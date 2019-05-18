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
import {
  Status,
  SourceLinkType,
  SourceSelectorMode,
  Source,
  SourceSelectOption
} from "../utils/types";
import SourceRefSearch from "./sourceEditor/SourceRefSearch";
import SourceDetails from "./SourceDetails";
import IconButton from "./buttons/IconButton";

type OwnProps = {
  editorId: string;
  sourceKey?: string;
  refInputValue: string;
  refInputChange: (newValue: string) => void;
  onSourceSelected: (option: SourceSelectOption) => void;
  onSourceDeselected: () => void;
  mode: SourceSelectorMode;
  changeMode: (newMode: SourceSelectorMode) => void;
};

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  // Get the POST request state from the Redux Store
  const { editorId } = props;
  const postData = state.requests.data[editorId];
  const postStatus = state.requests.status[editorId];
  const postError = state.requests.errors[editorId];
  // Get the GET request state for the Source generator (from ref)
  const refEditorId = "ref_" + props.editorId;
  const refGetData = state.requests.data[refEditorId] as Source | undefined;
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

/**
 * Possible scenarios:
 *  - The user selects an existing ref:
 *    -> Trust source.fullUrl as the fullUrl
 *       (put it in SourceLink too, for good measure)
 *  - The user inputs a URL + wants to "create it"
 *    -> The URL input should be the fullUrl
 *    -> Ask the server about this ref.
 *       - It exists.
 *          -> Link the existing source, no edit needed.
 *       - It doesn't exist.
 *          -> Create a new Source with the same fullUrl as SourceLink.
 * @extends React
 */
class SourceSelector extends React.Component<Props> {
  onCreateSource = (value: string) => {
    console.log("Creating source");
    this.props.getSourceFromRef(value, this.props.refEditorId);
    // Now we wait for the server response about this ref.
    // this.props.changeMode(SourceSelectorMode.EditingNewSource);
  };

  componentDidUpdate() {
    const { mode, refGetData } = this.props;
    if (mode === SourceSelectorMode.EditingRef && refGetData) {
      if (refGetData._key) {
        this.props.changeMode(SourceSelectorMode.SourceSelected);
        this.props.onSourceSelected({
          value: refGetData._key,
          label: refGetData.pTitle || refGetData.description || refGetData.ref,
          ref: refGetData.ref,
          pTitle: refGetData.pTitle || "",
          fullUrl: refGetData.fullUrl
        });
      } else {
        this.props.changeMode(SourceSelectorMode.EditingNewSource);
      }
    }
  }

  deselect = () => {
    this.props.clearGetSourceFromRefRequest(this.props.refEditorId);
    this.props.onSourceDeselected();
  };

  render() {
    const { refGetData, refGetStatus, refGetError, mode } = this.props;

    if (refGetStatus === Status.Requested || refGetStatus === Status.Error)
      return (
        <MetaPostStatus
          isGet
          status={refGetStatus}
          error={refGetError}
          clearRequest={() => {
            this.props.changeMode(SourceSelectorMode.EditingRef);
            this.props.clearGetSourceFromRefRequest(this.props.refEditorId);
          }}
        />
      );

    switch (mode) {
      case SourceSelectorMode.EditingRef:
        return (
          <SourceRefSearch
            onChange={this.props.onSourceSelected}
            inputValue={this.props.refInputValue}
            onInputChange={this.props.refInputChange}
            onCreateSource={this.onCreateSource}
          />
        );
      case SourceSelectorMode.EditingNewSource:
        if (!refGetData) {
          console.error("Missing source");
          return (
            <div>
              <em>Missing source data! Can't proceed.</em>
            </div>
          );
        }
        return (
          <SourceForm
            key={this.props.editorId}
            editorId={this.props.editorId}
            initialSource={refGetData}
            onCancelClick={this.deselect}
          />
        );
      case SourceSelectorMode.SourceSelected:
        if (!this.props.sourceKey) {
          console.error("sourceKey is undefined, but mode is SourceSelected");
        }
        return (
          <div>
            <IconButton onClick={this.deselect}>Pick another</IconButton>
            {this.props.sourceKey ? (
              <SourceDetails
                sourceKey={this.props.sourceKey}
                sourceLink={{
                  comments: [],
                  fullUrl: this.props.refInputValue,
                  type: SourceLinkType.Neutral
                }}
              />
            ) : (
              "Missing source key!"
            )}
          </div>
        );
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceSelector);
