import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import styled from "styled-components";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import { connect } from "react-redux";

import { RootStore } from "../Store";
import { getRelationId, shouldLoad } from "../utils/utils";
import {
  saveEdge,
  clearPostRequest,
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

  var entity1 = null;
  var entity1Status = null;
  if (entity1Key) {
    entity1 = state.entities.data[entity1Key];
    entity1Status = state.entities.status[entity1Key];
  } else {
    console.warn("EdgeEditor: Invalid entity1Key parameter:", entity1Key);
  }
  var entity2 = null;
  var entity2Status = null;
  if (entity2Key) {
    entity2 = state.entities.data[entity2Key];
    entity2Status = state.entities.status[entity2Key];
  } else {
    console.warn("EdgeEditor: Invalid entity2Key parameter:", entity2Key);
  }
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
  const sourceEditorId = "sou_" + editorId;
  const sourceFormData = state.sourceForms[sourceEditorId];

  return {
    ...props,
    sourceEditorId,
    sourceFormData,
    relationId,
    postData,
    postStatus,
    postError,
    entity1,
    entity1Status,
    entity2,
    entity2Status,
    edge,
    edgeStatus,
    edgeError
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      loadEdge,
      saveEdge,
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
    this.props.saveEdge(
      this.props.editorId,
      edge,
      sourceLink,
      this.props.sourceEditorId
    );
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
    const { entity1, entity1Status, entity2, entity2Status } = this.props;

    // First of all, we need to load the edge to edit (if any)
    if (edgeKey && edgeStatus !== Status.Ok)
      return <Meta status={edgeStatus} error={edgeError} />;
    if (!entity1) return <Meta status={entity1Status} />;
    if (!entity2) return <Meta status={entity2Status} />;

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
          entity1={entity1}
          entity2={entity2}
          key={edgeKey}
          initialEdge={edge}
          onFormSubmit={this.onFormSubmit}
          onDelete={this.onDelete}
          disabled={postStatus === Status.Requested}
          sourceEditorId={this.props.sourceEditorId}
          loadSources={this.props.loadSources}
          sourceFormData={this.props.sourceFormData}
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
