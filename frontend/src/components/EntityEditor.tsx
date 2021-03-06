import React from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import cuid from "cuid";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import { connect } from "react-redux";

import { RootStore } from "../Store";
import ROUTES from "../utils/ROUTES";
import {
  postEntity,
  clearPostRequest,
  patchEntity,
} from "../features/entitiesSaveAC";
import { loadEntity } from "../features/entitiesLoadAC";
import { Status, Entity, EntityType } from "../utils/types";
import EntityForm from "./entityEditor/EntityForm";
import Meta from "./meta/Meta";
import MetaPostStatus from "./meta/MetaPostStatus";
import { shouldLoad } from "../utils/utils";
import IconButton from "./buttons/IconButton";

const Content = styled.div`
  display: block;
  padding: 12px;
`;

type OwnProps = {
  entityKey?: string;
  initialName?: string;
  onDone?: (entity?: Entity) => void;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

// It's hard to control when they're re-created through the React lifecycle
// so the user just manually clears it when it's okay.
const editorId = cuid.slug();

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { entityKey, initialName, onDone } = props;
  // Get the entity (if any) from the Redux Store
  const entity: Entity | null | undefined = entityKey
    ? state.entities.data[entityKey]
    : initialName
    ? {
        name: initialName,
        type: EntityType.Human,
      }
    : undefined;
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
    initialName,
    onDone,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      loadEntity,
      postEntity,
      patchEntity,
      clearPostRequest,
    },
    dispatch
  );

class EntityEditor extends React.Component<Props> {
  componentDidMount() {
    // If we're in "add new entity" mode and the inital entity isn't loaded:
    if (this.props.entityKey && shouldLoad(this.props.entityStatus))
      this.props.loadEntity(this.props.entityKey);
  }

  onFormSubmit = (entity: Entity) => {
    if (this.props.entityKey) {
      this.props.patchEntity(entity, this.props.editorId);
    } else {
      this.props.postEntity(entity, this.props.editorId);
    }
  };

  onClearClick = () => {
    this.props.clearPostRequest(this.props.editorId);
    if (this.props.onDone) this.props.onDone(this.props.data);
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
          {this.props.onDone ? (
            <IconButton withText onClick={this.onClearClick}>
              Ok
            </IconButton>
          ) : (
            <Link
              onClick={this.onClearClick}
              to={`/${ROUTES.entity}/${this.props.data._key}`}
            >
              Ok
            </Link>
          )}
        </Content>
      );

    return (
      <Content>
        <EntityForm
          key={this.props.entityKey}
          initialEntity={this.props.entity}
          onFormSubmit={this.onFormSubmit}
          onFormCancel={this.props.onDone}
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
