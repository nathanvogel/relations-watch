import React from "react";
import styled from "styled-components";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import { connect } from "react-redux";

import SourceForm from "./sourceEditor/SourceForm";
import MetaPostStatus from "./meta/MetaPostStatus";
import { RootStore } from "../Store";
import { getSourceFromRef } from "../features/sourcesAC";
import { Status, ReactSelectOption } from "../utils/types";
import SourceRefSearch from "./sourceEditor/SourceRefSearch";

const Content = styled.div`
  disply: block;
`;

const Label = styled.label`
  display: block;
`;

type OwnProps = {
  editorId: string;
  sourceKey?: string;
  onSourceSelected?: (sourceKey: string) => void;
};

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  // Get the POST request state from the Redux Store
  const { editorId } = props;
  const postData = state.requests.data[editorId];
  const postStatus = state.requests.status[editorId];
  const postError = state.requests.errors[editorId];
  // Get the GET request state for the Source generator (from ref)
  const refEditorId = "ref_" + props.editorId;
  const refGetData = state.requests.data[refEditorId];
  const refGetStatus = state.requests.status[refEditorId];
  const refGetError = state.requests.errors[refEditorId];

  return {
    ...props,
    refEditorId,
    postData,
    postStatus,
    postError,
    refGetData,
    refGetStatus,
    refGetError
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
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

  onSelectSource = (option: ReactSelectOption) => {
    if (this.props.onSourceSelected) this.props.onSourceSelected(option.value);
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
          <Label>
            Source document:
            <SourceRefSearch
              onChange={this.onSelectSource}
              inputValue={sourceRef}
              onInputChange={this.onSourceRefChange}
              onCreateRef={this.onCreateRef}
            />
          </Label>
        </Content>
      );

    return (
      <Content>
        {refGetStatus !== Status.Ok ? (
          <MetaPostStatus status={refGetStatus} error={refGetError} />
        ) : (
          <SourceForm
            key={this.props.editorId}
            editorId={this.props.editorId}
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
