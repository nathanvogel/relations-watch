import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { RootStore } from "../Store";
import ROUTES from "../utils/ROUTES";
import { getRelationId, shouldLoad } from "../utils/utils";
import { bindActionCreators, Dispatch } from "redux";
import { RootAction } from "../utils/ACTIONS";
import { connect } from "react-redux";
import {
  postEdge,
  clearPostRequest,
  patchEdge,
  loadEdge
} from "../features/relationsActionCreators";
import { Edge, Status } from "../utils/types";
import MetaPostStatus from "./MetaPostStatus";
import Meta from "./Meta";
import EdgeForm from "./EdgeForm";

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

  return {
    ...props,
    relationId,
    postData,
    postStatus,
    postError,
    edge,
    edgeStatus,
    edgeError
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      loadEdge,
      postEdge,
      patchEdge,
      clearPostRequest
    },
    dispatch
  );

class EdgeEditor extends React.Component<Props> {
  componentDidMount() {
    // If we're in "add new edge" mode and the inital edge isn't loaded:
    if (this.props.edgeKey && shouldLoad(this.props.edgeStatus))
      this.props.loadEdge(this.props.edgeKey);
  }

  onFormSubmit = (edge: Edge) => {
    if (this.props.edgeKey) {
      this.props.patchEdge(edge, this.props.editorId);
    } else {
      this.props.postEdge(edge, this.props.editorId);
    }
  };

  clearPostRequest = (event: React.MouseEvent<HTMLAnchorElement>) => {
    this.props.clearPostRequest(this.props.editorId);
    if (this.props.dismiss) this.props.dismiss();
  };

  render() {
    const { entity1Key, entity2Key } = this.props;
    const relationRoute = `/${ROUTES.relation}/${entity1Key}/${entity2Key}`;
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
    if (postStatus === Status.Ok)
      return (
        <Content>
          <p>Saved!</p>
          <Link onClick={this.clearPostRequest} to={relationRoute}>
            Ok
          </Link>
        </Content>
      );

    return (
      <Content>
        <EdgeForm
          entity1Key={entity1Key}
          entity2Key={entity2Key}
          key={edgeKey}
          initialEdge={edge}
          onFormSubmit={this.onFormSubmit}
          disabled={postStatus === Status.Requested}
        />
        {/* <Button onClick={this.props.dismiss}>Cancel</Button> */}
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
