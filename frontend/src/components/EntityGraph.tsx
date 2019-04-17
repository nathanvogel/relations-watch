import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootStore } from "../Store";
import { RootAction } from "../utils/ACTIONS";
import { loadEntity } from "../features/entitiesLoadAC";
import Button from "../components/Button";
import ROUTES from "../utils/ROUTES";
import Meta from "../components/Meta";
import { Status } from "../utils/types";
import { loadEntityGraph } from "../features/linksLoadAC";
import GraphEntityNode from "../components/GraphEntityNode";
import CONSTS from "../utils/consts";

const Content = styled.div``;

type OwnProps = {
  entityKey: string;
};

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const baseEntityKey = props.entityKey;
  // Get the entity from the Redux Store
  const entity = state.entities.data[baseEntityKey];
  const status = state.entities.status[baseEntityKey];
  const error = state.entities.errors[baseEntityKey];
  const linkedEntities = state.links.data.byentity[baseEntityKey]
    ? state.links.data.byentity[baseEntityKey].entities
    : [];
  const linksStatus = state.links.status[baseEntityKey];
  const linksError = state.links.errors[baseEntityKey];

  const entityPreviews = state.entities.datapreview;

  // Return everything.
  return {
    baseEntityKey,
    entity,
    status,
    error,
    linkedEntities,
    linksStatus,
    linksError,
    entityPreviews
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

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class EntityGraph extends Component<Props> {
  componentDidMount() {
    if (!this.props.status || this.props.status === Status.Error)
      this.props.loadEntity(this.props.baseEntityKey);
    if (!this.props.linksStatus || this.props.linksStatus === Status.Error)
      this.props.loadEntityGraph(this.props.baseEntityKey);
  }

  render() {
    const { entity, status, error, baseEntityKey } = this.props;
    const W = 800;
    const H = 800;
    const CX = W / 2;
    const CY = H / 2;

    // Render loading status and error.
    if (status !== Status.Ok)
      return (
        <Content>
          <Meta status={status} error={error} />
        </Content>
      );

    const linkedEntities = this.props.linkedEntities;
    const entityCount = linkedEntities.length;
    const nodeData = [];
    const minDist = 150;
    const maxDist = W / 2 - minDist - 40;
    const maxEdgeCount = entityCount > 0 ? linkedEntities[0][1] : 1;
    for (let i = 0; i < entityCount; i++) {
      const entityKey = linkedEntities[i][0];
      const edgeCount = linkedEntities[i][1];
      const angle = i * ((Math.PI * 2) / entityCount) + Math.PI;
      const distance =
        minDist + ((maxEdgeCount - edgeCount) / maxEdgeCount) * maxDist;
      const x = CX + Math.sin(angle) * distance;
      const y = CY + Math.cos(angle) * distance;
      const datapoint = {
        entityKey,
        edgeCount,
        angle,
        distance,
        x,
        y,
        entity: this.props.entityPreviews[entityKey]
      };
      nodeData.push(datapoint);
    }

    return (
      <Content>
        <svg width={W} height={H}>
          {nodeData.map(datapoint => (
            <GraphEntityNode
              entity={datapoint.entity}
              x={datapoint.x}
              y={datapoint.y}
              baseEntityKey={baseEntityKey}
            />
          ))}
          <GraphEntityNode entity={entity} x={CX} y={CY} primary />
        </svg>
        <Button to={`/${ROUTES.relation}/${baseEntityKey}/${CONSTS.EMPTY_KEY}`}>
          New relation
        </Button>
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityGraph);
