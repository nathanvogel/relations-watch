import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootStore } from "../Store";
import { RootAction } from "../utils/ACTIONS";
import { loadEntity } from "../features/entitiesLoadAC";
import Button from "../components/buttons/Button";
import ROUTES from "../utils/ROUTES";
import Meta from "../components/meta/Meta";
import { Status } from "../utils/types";
import { loadEntityGraph } from "../features/linksLoadAC";
import EntityGraph from "../components/EntityGraph";

const Content = styled.div``;

interface EntityMatch {
  entityKey: string;
}

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (state: RootStore, props: RouteComponentProps) => {
  // Get the entityKey from the Router props
  const params = props.match.params as EntityMatch;
  const entityKey: string = params["entityKey"];
  // Get the entity from the Redux Store
  const entity = state.entities.data[entityKey];
  const status = state.entities.status[entityKey];
  const error = state.entities.errors[entityKey];
  const linkedEntities = state.links.data.byentity[entityKey]
    ? state.links.data.byentity[entityKey].entities
    : [];
  const linksStatus = state.links.status[entityKey];
  const linksError = state.links.errors[entityKey];
  // Return everything.
  return {
    entityKey,
    entity,
    status,
    error,
    linkedEntities,
    linksStatus,
    linksError
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      loadEntity,
      loadEntityGraph
    },
    dispatch
  );

class EntityScreen extends Component<Props> {
  componentDidMount() {
    if (!this.props.status || this.props.status === Status.Error)
      this.props.loadEntity(this.props.entityKey);
    if (!this.props.linksStatus || this.props.linksStatus === Status.Error)
      this.props.loadEntityGraph(this.props.entityKey);
  }

  render() {
    const { entity, status, error, entityKey } = this.props;

    // Render loading status and error.
    if (status !== Status.Ok)
      return (
        <Content>
          <Meta status={status} error={error} />
        </Content>
      );

    return (
      <Content>
        <Button to={`/${ROUTES.edit}/${ROUTES.entity}/${this.props.entityKey}`}>
          Edit {entity.name}
        </Button>
        <EntityGraph entityKey={entityKey} />
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityScreen);
