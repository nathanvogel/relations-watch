import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import { Link } from "react-router-dom";

import { RootStore } from "../Store";
import { loadEntity } from "../features/entitiesLoadAC";
import Button from "../components/buttons/Button";
import ROUTES from "../utils/ROUTES";
import Meta from "../components/meta/Meta";
import { Status, LinkRenderData } from "../utils/types";
import { loadEntityGraph } from "../features/linksLoadAC";
import GraphEntityNode from "./entityGraph/GraphEntityNode";
import CONSTS from "../utils/consts";
import GraphLink from "./entityGraph/GraphLink";

const Content = styled.div``;

const GraphSVG = styled.svg`
  display: block;
  margin: 0 auto;
`;

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
  const linkedEdges = state.links.data.byentity[baseEntityKey]
    ? state.links.data.byentity[baseEntityKey].edges
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
    linkedEdges,
    linksStatus,
    linksError,
    entityPreviews
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
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

    // Calculate entity positions
    const linkedEntities = this.props.linkedEntities;
    const entityCount = linkedEntities.length;
    const nodeData = [];
    // const nodeDataByEntity:{[key:string]:{}} = {};
    const renderedLinks: { [key: string]: LinkRenderData } = {};
    const minDist = 150;
    const maxDist = W / 2 - minDist - 40;
    const maxEdgeCount = entityCount > 0 ? linkedEntities[0][1] : 1;
    for (let i = 0; i < entityCount; i++) {
      const entityKey = linkedEntities[i][0];
      const edgeCount = linkedEntities[i][1];
      const angle = -i * ((Math.PI * 2) / entityCount) + Math.PI;
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
      if (datapoint.entity) nodeData.push(datapoint);
      // nodeDataByEntity[entityKey] = datapoint;
      // Already to start to build edge data, we will complete it with
      // types afterwards.
      renderedLinks[entityKey] = {
        x1: CX,
        y1: CY,
        x2: x,
        y2: y,
        angle,
        entityKey,
        types: []
      };
    }

    const linkedEdges = this.props.linkedEdges;
    const linkCount = linkedEdges.length;
    for (let i = 0; i < linkCount; i++) {
      const link = linkedEdges[i];
      const other = link._from === baseEntityKey ? link._to : link._from;
      const t = renderedLinks[other].types;
      if (t.indexOf(link.type) < 0) t.push(link.type);
    }
    // Sort the types simply for consistency across relations.
    for (let key in renderedLinks) {
      renderedLinks[key].types.sort((a, b) => a - b);
    }

    return (
      <Content>
        <Button to={`/${ROUTES.relation}/${baseEntityKey}/${CONSTS.EMPTY_KEY}`}>
          New relation
        </Button>
        <GraphSVG width={W} height={H} xmlns="http://www.w3.org/2000/svg">
          {Object.keys(renderedLinks).map(entityKey => (
            <Link
              key={entityKey}
              to={`/${ROUTES.relation}/${baseEntityKey}/${entityKey}`}
            >
              <GraphLink data={renderedLinks[entityKey]} />
            </Link>
          ))}
          {nodeData.map(datapoint => (
            <Link
              key={datapoint.entity._key}
              to={`/${ROUTES.entity}/${datapoint.entity._key}`}
            >
              <GraphEntityNode
                entity={datapoint.entity}
                x={datapoint.x}
                y={datapoint.y}
              />
            </Link>
          ))}
          <GraphEntityNode entity={entity} x={CX} y={CY} primary />
        </GraphSVG>
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityGraph);
