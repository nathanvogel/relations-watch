import React from "react";
import styled from "styled-components";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

import SourceRefEditor from "./sourceEditor/SourceRefEditor";
import SourceForm from "./sourceEditor/SourceForm";
import MetaPostStatus from "./MetaPostStatus";
import { RootStore } from "../Store";
import { RootAction } from "../utils/ACTIONS";
import { getSourceFromRef } from "../features/sourcesAC";
import { Status, Source, SourceFormData } from "../utils/types";

const Content = styled.div`
  disply: block;
`;

type OwnProps = {
  sourceKey?: string;
  editorId: string;
};

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  // Get the POST request state from the Redux Store
  const { editorId } = props;
  const postData = state.requests.data[editorId];
  const postStatus = state.requests.status[editorId];
  const postError = state.requests.errors[editorId];
  // Get the GET request state for the Source generator (from ref)
  const refEditorId = "ref-" + props.editorId;
  const refGetData = state.requests.data[refEditorId];
  const refGetStatus = state.requests.status[refEditorId];
  const refGetError = state.requests.errors[refEditorId];

  return {
    editorId,
    refEditorId,
    postData,
    postStatus,
    postError,
    refGetData,
    refGetStatus,
    refGetError
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      getSourceFromRef
    },
    dispatch
  );

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class SourceEditor extends React.Component<Props> {
  readonly state = {
    editingRef: true,
    sourceRef: ""
  };

  onSourceRefChange = (value: string) => {
    this.setState({
      sourceRef: value
    });
  };

  onCreateRef = (value: string) => {
    this.props.getSourceFromRef(value, this.props.refEditorId);
    // Now we want to edit the source.
    // Put the ref value state again, because it's cleared with onChange by
    // react-select when it's unmounted
    this.setState({ editingRef: false, sourceRef: value });
  };

  onCancelSourceFormClick = () => {
    this.setState({ editingRef: true });
  };

  render() {
    const { editingRef, sourceRef } = this.state;
    const { refGetData, refGetStatus, refGetError } = this.props;

    if (this.state.editingRef)
      return (
        <Content>
          <SourceRefEditor
            sourceRef={sourceRef}
            onSourceRefChange={this.onSourceRefChange}
            onCreateRef={this.onCreateRef}
          />
        </Content>
      );

    return (
      <Content>
        {refGetStatus !== Status.Ok ? (
          <MetaPostStatus status={refGetStatus} error={refGetError} />
        ) : (
          <SourceForm
            key={"form-" + this.props.editorId}
            editorId={"form-" + this.props.editorId}
            initialSource={refGetData}
            onCancelClick={this.onCancelSourceFormClick}
          />
        )}
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceEditor);
