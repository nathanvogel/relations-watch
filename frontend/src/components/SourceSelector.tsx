import React from "react";
import styled from "styled-components";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import { connect } from "react-redux";

import SourceForm from "./SourceForm";
import MetaPostStatus from "./meta/MetaPostStatus";
import { RootStore } from "../Store";
import {
  getSourceFromRef,
  clearGetSourceFromRefRequest
} from "../features/sourcesAC";
import { Status, ReactSelectOption, SourceLinkType } from "../utils/types";
import SourceRefSearch from "./sourceEditor/SourceRefSearch";
import SourceDetails from "./SourceDetails";
import IconButton from "./buttons/IconButton";

const Content = styled.div`
  display: block;
`;

const StyledSourceRefSearch = styled(SourceRefSearch)`
  width: 100%;
`;

type OwnProps = {
  editorId: string;
  sourceKey?: string;
  onSourceSelected: (sourceKey?: string, fullUrl?: string) => void;
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
      getSourceFromRef,
      clearGetSourceFromRefRequest
    },
    dispatch
  );

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

enum SelectorMode {
  SourceSelected,
  EditingRef,
  EditingNewSource
}

class SourceSelector extends React.Component<Props> {
  readonly state = {
    mode: SelectorMode.EditingRef,
    sourceRef: ""
  };

  onSourceRefChange = (value: string) => {
    this.setState({
      sourceRef: value
    });
  };

  onCreateSource = (value: string) => {
    this.props.getSourceFromRef(value, this.props.refEditorId);
    // Now we want to edit the source.
    // Put the ref value state again, because it's cleared with onChange by
    // react-select when it's unmounted
    this.setState({ mode: SelectorMode.EditingNewSource, sourceRef: value });
  };

  onSelectSource = (option: ReactSelectOption) => {
    this.props.onSourceSelected(option.value, this.state.sourceRef);
    this.setState({ mode: SelectorMode.SourceSelected });
  };

  onDeselectSource = () => {
    this.props.onSourceSelected();
    this.setState({ mode: SelectorMode.EditingRef });
  };

  render() {
    const { mode, sourceRef } = this.state;
    const { refGetData, refGetStatus, refGetError } = this.props;

    switch (mode) {
      case SelectorMode.EditingRef:
        return (
          <Content>
            <StyledSourceRefSearch
              onChange={this.onSelectSource}
              inputValue={sourceRef}
              onInputChange={this.onSourceRefChange}
              onCreateSource={this.onCreateSource}
            />
          </Content>
        );
      case SelectorMode.EditingNewSource:
        return (
          <Content>
            {refGetStatus !== Status.Ok ? (
              <MetaPostStatus
                isGet
                status={refGetStatus}
                error={refGetError}
                clearRequest={() => {
                  this.setState({ mode: SelectorMode.EditingRef });
                  this.props.clearGetSourceFromRefRequest(
                    this.props.refEditorId
                  );
                }}
              />
            ) : (
              <SourceForm
                key={this.props.editorId}
                editorId={this.props.editorId}
                initialSource={refGetData}
                onCancelClick={this.onDeselectSource}
              />
            )}
          </Content>
        );
      case SelectorMode.SourceSelected:
        if (!this.props.sourceKey) {
          console.error("sourceKey is undefined, but mode is SourceSelected");
        }
        return (
          <Content>
            <IconButton onClick={this.onDeselectSource}>
              Pick another
            </IconButton>
            {this.props.sourceKey ? (
              <SourceDetails
                sourceKey={this.props.sourceKey}
                sourceLink={{
                  comments: [],
                  fullUrl: this.state.sourceRef,
                  type: SourceLinkType.Neutral
                }}
              />
            ) : (
              "Missing source key!"
            )}
          </Content>
        );
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceSelector);
