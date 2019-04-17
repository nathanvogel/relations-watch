import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import cuid from "cuid";

import { RootStore } from "../Store";
import ROUTES from "../utils/ROUTES";
import { bindActionCreators, Dispatch } from "redux";
import { RootAction } from "../utils/ACTIONS";
import { connect } from "react-redux";
import {
  postEntity,
  clearPostRequest,
  patchEntity
} from "../features/entitiesSaveAC";
import { loadEntity } from "../features/entitiesLoadAC";
import { Status, EntityForUpload } from "../utils/types";
import EntityForm from "./EntityForm";
import Meta from "./Meta";
import MetaPostStatus from "./MetaPostStatus";
import { shouldLoad } from "../utils/utils";

const Content = styled.div`
  display: block;
  padding: 12px;
`;

type OwnProps = {
  entityKey?: string;
} & RouteComponentProps;

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

// It's hard to control when they're re-created through the React lifecycle
// so the user just manually clears it when it's okay.
const editorId = cuid.slug();

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const entityKey = props.entityKey;
  // Get the entity (if any) from the Redux Store
  const entity = entityKey ? state.entities.data[entityKey] : undefined;
  const entityStatus = entityKey ? state.entities.status[entityKey] : undefined;
  const entityError = entityKey ? state.entities.errors[entityKey] : undefined;
  // Get the POST request state from the Redux Store
  const data = state.requests.data[editorId];
  const postStatus = state.requests.status[editorId];
  const postError = state.requests.errors[editorId];

  return {
    data,
    editorId,
    postStatus,
    postError,
    entityKey,
    entity,
    entityStatus,
    entityError,
    history: props.history
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      loadEntity,
      postEntity,
      patchEntity,
      clearPostRequest
    },
    dispatch
  );

class EntityEditor extends React.Component<Props> {
  componentDidMount() {
    // If we're in "add new entity" mode and the inital entity isn't loaded:
    if (this.props.entityKey && shouldLoad(this.props.entityStatus))
      this.props.loadEntity(this.props.entityKey);
  }

  onFormSubmit = (entity: EntityForUpload) => {
    if (this.props.entityKey) {
      this.props.patchEntity(entity, this.props.editorId);
    } else {
      this.props.postEntity(entity, this.props.editorId);
    }
  };

  clearPostRequest = (_event: React.MouseEvent<HTMLAnchorElement>) => {
    this.props.clearPostRequest(this.props.editorId);
  };

  onCancelClick = () => {
    this.props.history.goBack();
  };

  render() {
    const { postStatus, postError } = this.props;
    const { entityStatus, entityError } = this.props;

    // First of all, we need to load the entity to edit (if any)
    if (this.props.entityKey && entityStatus !== Status.Ok)
      return (
        <Content>
          <Meta status={entityStatus} error={entityError} />
        </Content>
      );

    // Once successfuly updated in the server, we let the user know about it.
    if (postStatus === Status.Ok)
      return (
        <Content>
          <p>Saved!</p>
          <Link
            onClick={this.clearPostRequest}
            to={`/${ROUTES.entity}/${this.props.data._key}`}
          >
            Ok
          </Link>
        </Content>
      );

    return (
      <Content>
        <EntityForm
          key={this.props.entityKey}
          initialEntity={this.props.entity}
          onFormSubmit={this.onFormSubmit}
          disabled={postStatus === Status.Requested}
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
  )(EntityEditor)
);
