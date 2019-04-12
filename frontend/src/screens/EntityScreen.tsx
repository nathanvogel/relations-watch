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
import Meta from "../components/Meta";
import { Status } from "../utils/types";
import { loadLinks } from "../features/linksActionCreators";
import LinkedEntityPreview from "../components/LinkedEntityPreview";

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
      loadLinks
    },
    dispatch
  );

class EntityScreen extends Component<Props> {
  componentDidMount() {
    if (!this.props.status || this.props.status === Status.Error)
      this.props.loadEntity(this.props.entityKey);
    if (!this.props.linksStatus || this.props.linksStatus === Status.Error)
      this.props.loadLinks(this.props.entityKey);
  }

  render() {
    const { entity, status, error, entityKey } = this.props;
    const linkedEntities = this.props.linkedEntities;

    // Render loading status and error.
    if (status !== Status.Ok)
      return (
        <Content>
          <Meta status={status} error={error} />
        </Content>
      );

    return (
      <Content>
        <PersonName>{entity.name}</PersonName>
        <Button
          to={`/${ROUTES.relation}/${ROUTES.add}/${this.props.entityKey}`}
        >
          New relation
        </Button>
        {linkedEntities ? (
          <ul>
            {linkedEntities.map(e => (
              <LinkedEntityPreview
                key={e[0]}
                entityKey={e[0]}
                baseEntityKey={entityKey}
              />
            ))}
          </ul>
        ) : (
          <p>No relations to show</p>
        )}
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityScreen);
