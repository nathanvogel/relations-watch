import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import { Link } from "react-router-dom";

import { RootStore } from "../Store";
import { loadEntity } from "../features/entitiesLoadAC";
import Meta from "../components/meta/Meta";
import { Status } from "../utils/types";
import { getEntityLAsset } from "../assets/EntityIcons";
import MainPersonImage from "./entityDetails/MainPersonImage";

const Content = styled.div`
  width: 100%;
`;

const PersonName = styled.div`
  text-align: center;
  font-size: ${props => props.theme.fontSizeM};
  margin: ${props => props.theme.marginTB};
  // text-decoration: none;
  // color: #001144;
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

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
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
          <MainPersonImage src={getEntityLAsset(entity.type)} />
          <PersonName>{entity.name}</PersonName>
        </Link>
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityDetails);
