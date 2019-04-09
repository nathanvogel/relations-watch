import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootStore, Entity } from "../Store";
import { RootAction } from "../utils/ACTIONS";
import { loadEntity } from "../features/entitiesActionCreators";
import Button from "../components/Button";
import ROUTES from "../utils/ROUTES";

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
  const entity = state.entities[entityKey];
  // Return everything.
  return {
    entityKey,
    entity
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      loadEntity: loadEntity
    },
    dispatch
  );

// const mapDispatchToProps = dispatch => ({
//   startAuthUI: () => dispatch(startAuthUI())
// });

class EntityScreen extends Component<Props> {
  componentDidMount() {
    console.log("Key: ", this.props.entityKey);
    this.props.loadEntity(this.props.entityKey);
  }

  render() {
    const { entity } = this.props;
    console.log("render: ", entity);
    return (
      <Content>
        {!entity ? (
          <p>Nothing yet</p>
        ) : entity.status === "ok" ? (
          <PersonName>{entity.payload.name}</PersonName>
        ) : (
          <p>Loading...</p>
        )}
        <Button to={`/${ROUTES.relation}/${ROUTES.new}`}>New relation</Button>
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityScreen);
