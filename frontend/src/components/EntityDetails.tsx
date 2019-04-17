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
import DefaultPerson from "../assets/physical_p_default_full_512.png";
import CONSTS from "../utils/consts";

const Content = styled.div`
  width: 100%;
`;

const PersonName = styled.h5`
  text-align: center;
  font-size: 18px;
  text-decoration: none;
  color: #001144;
`;

const PersonImage = styled.img`
  display: block;
  max-width: 100%;
  width: 180px;
  margin: 0 auto;
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
          <PersonImage src={DefaultPerson} />
          <PersonName>{entity.name}</PersonName>
        </Link>
        <p>
          {entity.type === CONSTS.ENTITY_TYPES.PHYSICAL_PERSON
            ? "Physical person"
            : "Legal person"}
        </p>
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityDetails);
