import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { Link } from "react-router-dom";

import { RootStore } from "../Store";
import { RootAction } from "../utils/ACTIONS";
import { loadEntity } from "../features/entitiesLoadAC";
import Meta from "../components/Meta";
import { Status } from "../utils/types";

const Content = styled.div`
  width: 100%;
`;

const PersonName = styled.h5`
  text-align: left;
  font-size: 14px;
`;

type OwnProps = { entityKey: string };

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const entityKey = props.entityKey;
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

class EntityDetails extends Component<Props> {
  componentDidMount() {
    if (!this.props.status || this.props.status === Status.Error)
      this.props.loadEntity(this.props.entityKey);
  }

  render() {
    const { entity, status, error } = this.props;

    // Render loading status and error.
    const meta = <Meta status={status} error={error} />;
    if (status !== Status.Ok) return <Content>{meta}</Content>;

    return (
      <Content>
        <Link to={`/e/${this.props.entityKey}`}>
          <PersonName>{entity.name}</PersonName>
        </Link>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityDetails);
