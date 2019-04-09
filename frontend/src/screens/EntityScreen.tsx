import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootStore } from "../Store";
import { RootAction } from "../utils/ACTIONS";
import { loadEntity } from "../features/entitiesActionCreators";
import Button from "../components/Button";
import ROUTES from "../utils/ROUTES";
import { Status, ErrorPayload } from "../utils/types";

const Content = styled.div`
  width: 960px;
  max-width: calc(100% - 64px);
  margin-top: 32px;
  margin-left: 32px;
  margin-right: 32px;
  // box-sizing: border-box;
`;

const PersonName = styled.h2`
  text-align: left;
  font-size: 24px;
`;

interface EntityMatch {
  entityKey: string;
}

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & {
    label: string;
    entityKey: string;
  };

const mapStateToProps = (state: RootStore, props: RouteComponentProps) => {
  // Get the entityKey from the Router props
  const params = props.match.params as EntityMatch;
  const entityKey: string = params["entityKey"];
  // Get the entity from the Redux Store
  const entity = state.entities.data[entityKey];
  const status = state.entities.status[entityKey];
  const error = state.entities.errors[entityKey];
  // Return everything.
  return {
    entityKey,
    entity,
    status,
    error
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      loadEntity: loadEntity
    },
    dispatch
  );

class EntityScreen extends Component<Props> {
  componentDidMount() {
    this.props.loadEntity(this.props.entityKey);
  }

  getMeta = (status: Status, error: ErrorPayload) => {
    switch (status) {
      case undefined:
        return <p>Initializing...</p>;
      case Status.Requested:
        return <p>Loading...</p>;
      case Status.Error:
        return <p>Error: {error.eMessage}</p>;
      default:
        return null;
    }
  };

  render() {
    const { entity, status, error } = this.props;

    // Render loading status and error.
    const meta = this.getMeta(status, error);
    if (meta) {
      return <Content>{meta}</Content>;
    }

    return (
      <Content>
        <PersonName>{entity.name}</PersonName>
        <Button to={`/${ROUTES.relation}/${ROUTES.new}`}>New relation</Button>
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityScreen);
