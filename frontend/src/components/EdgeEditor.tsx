import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import styled from "styled-components";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import { connect } from "react-redux";

import { RootStore } from "../Store";
import { getRelationId, shouldLoad } from "../utils/utils";
import {
  postEdge,
  clearPostRequest,
  patchEdge,
  deleteEdge
} from "../features/edgesSaveAC";
import { loadEdge } from "../features/edgesLoadAC";
import { loadSources } from "../features/sourcesAC";
import { Edge, Status, SourceLink } from "../utils/types";
import MetaPostStatus from "./meta/MetaPostStatus";
import Meta from "./meta/Meta";
import EdgeForm from "./edgeEditor/EdgeForm";
import Button from "./buttons/Button";

const Content = styled.div`
  display: block;
  padding: 12px;
`;

type OwnProps = {
  entity1Key: string;
  entity2Key: string;
  editorId: string;
  edgeKey?: string;
  dismiss?: () => void;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { entity1Key, entity2Key, editorId, edgeKey } = props;
  if (!entity1Key)
    console.warn("EdgeEditor: Invalid entity1Key parameter:", entity1Key);
  if (!entity2Key)
    console.warn("EdgeEditor: Invalid entity2Key parameter:", entity2Key);
  // It's safe to assume we'll get an ID because entity1Key and entity2Key
  // are not nullable.
  const relationId = getRelationId(entity1Key, entity2Key);
  // Get the edge (if any) from the Redux Store
  const edge = edgeKey ? state.edges.data[edgeKey] : undefined;
  const edgeStatus = edgeKey ? state.edges.status[edgeKey] : undefined;
  const edgeError = edgeKey ? state.edges.errors[edgeKey] : undefined;
  // Get the POST request state from the Redux Store
  const postData = state.requests.data[editorId];
  const postStatus = state.requests.status[editorId];
  const postError = state.requests.errors[editorId];
  // Get the SourceFormData (used only if it's a new edge)
  // Otherwise, the source should be updated separately.
  const sourceFormData = state.sourceForms["sou_" + editorId];

  return {
    ...props,
    sourceFormData,
    relationId,
    postData,
    postStatus,
    postError,
    edge,
    edgeStatus,
    edgeError
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      loadEdge,
      postEdge,
      patchEdge,
      deleteEdge,
      clearPostRequest,
      loadSources
    },
    dispatch
  );

class EdgeEditor extends React.Component<Props> {
  componentDidMount() {
    // If we're in "add new edge" mode and the inital edge isn't loaded:
    if (this.props.edgeKey && shouldLoad(this.props.edgeStatus))
      this.props.loadEdge(this.props.edgeKey);
  }

  onFormSubmit = (edge: Edge, sourceLink?: SourceLink) => {
    const { editorId } = this.props;
    // EDIT mode
    if (this.props.edgeKey) {
      this.props.patchEdge(edge, editorId);
    }
    // CREATE MODE
    else {
      if (!sourceLink) {
        throw new Error("A source is required to post a new edge!");
      }
      this.props.postEdge(
        editorId,
        edge,
        sourceLink,
        sourceLink.sourceKey ? undefined : this.props.sourceFormData
      );
    }
  };

  onDelete = () => {
    if (this.props.edge)
      this.props.deleteEdge(this.props.edge, this.props.editorId);
    else console.warn("Can't delete an edge that doesn't exist yet");
  };

  clearPostRequest = (doDismiss: boolean) => {
    this.props.clearPostRequest(this.props.editorId);
    if (doDismiss && this.props.dismiss) this.props.dismiss();
  };

  render() {
    const { entity1Key, entity2Key } = this.props;
    const { postStatus, postError } = this.props;
    const { edgeKey, edge, edgeStatus, edgeError } = this.props;

    // First of all, we need to load the edge to edit (if any)
    if (edgeKey && edgeStatus !== Status.Ok)
      return (
        <Content>
          <Meta status={edgeStatus} error={edgeError} />
        </Content>
      );

    // Render loading status and error.
    if (postStatus === Status.Ok) {
      // If we're successfully editing an edge, no need to show the confirmation
      // TODO : Change, this is NOT a good React practice at all...
      if (edgeKey) {
        this.clearPostRequest(true);
        return null;
      }
      // If we're adding an edge: show a confirmation + offer back/new choice
      return (
        <Content>
          <p>
            Saved!{" "}
            <Button onClick={this.clearPostRequest.bind(this, true)}>Ok</Button>
          </p>
          {/*edgeKey || (
            <Button onClick={this.clearPostRequest.bind(this, false)}>
              New
            </Button>
          )*/}
        </Content>
      );
    }

    return (
      <Content>
        <EdgeForm
          entity1Key={entity1Key}
          entity2Key={entity2Key}
          key={edgeKey}
          initialEdge={edge}
          onFormSubmit={this.onFormSubmit}
          onDelete={this.onDelete}
          disabled={postStatus === Status.Requested}
          sourceEditorId={"sou_" + this.props.editorId}
          loadSources={this.props.loadSources}
        />
        <MetaPostStatus status={postStatus} error={postError} />
      </Content>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EdgeEditor)
);
