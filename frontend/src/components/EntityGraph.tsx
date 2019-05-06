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
import {
  Status,
  RelationRenderData,
  EdgePreview,
  NodeRenderData,
  NodeRenderType
} from "../utils/types";
import { loadEntityGraph } from "../features/linksLoadAC";
import GraphEntityNode from "./entityGraph/GraphEntityNode";
import CONSTS from "../utils/consts";
import GraphLink from "./entityGraph/GraphLink";
import { getEntityPreview, getRelationId } from "../utils/utils";
import GraphD3 from "./GraphD3";

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
  const toEntity = state.links.data.byentity[baseEntityKey]
    ? state.links.data.byentity[baseEntityKey].toEntity
    : {};
  /**
   * A sorted descendent array of directly connected
   * [entityKey, edgeCount] pairs
   */
  const connectedEntities: [string, number][] = state.links.data.byentity[
    baseEntityKey
  ]
    ? state.links.data.byentity[baseEntityKey].entities
    : [];
  const connectedEdges: EdgePreview[] = [];
  if (state.links.data.byentity[baseEntityKey])
    connectedEdges.push(...state.links.data.byentity[baseEntityKey].edges);
  const linksStatus = state.links.status[baseEntityKey];
  const linksError = state.links.errors[baseEntityKey];

  const entityPreviews = state.entities.datapreview;
  const relationPreviews = state.links.data.byrelation;

  const entitySelection = state.entitySelection;
  const selectedEntities = entitySelection.map(
    entityKey => state.entities.data[entityKey]
  );
  const extraEntitySelection = entitySelection.filter(
    selectedKey => selectedKey !== baseEntityKey && !toEntity[selectedKey]
  );
  // const extraEntities = entitySelection
  //   .filter(
  //     selectedKey => selectedKey !== baseEntityKey && !toEntity[selectedKey]
  //   )
  //   .map(entityKey => state.entities.data[entityKey]);

  // Add all additional useful edges
  for (let entity of selectedEntities) {
    // Check that the data is loaded
    if (!entity._key || !state.links.data.byentity[entity._key]) continue;
    const selectedEntityKey = entity._key;
    // Add all edges between selected entities
    // + edges between a selected entity and a non-selected 1st degree entity
    connectedEdges.push(
      ...state.links.data.byentity[entity._key].edges.filter(
        edge =>
          (entitySelection.indexOf(edge._from) >= 0 &&
            entitySelection.indexOf(edge._to) >= 0) ||
          extraEntitySelection.indexOf(selectedEntityKey) >= 0
      )
    );
  }

  // Return everything.
  return {
    baseEntityKey,
    entity,
    status,
    error,
    entitySelection,
    selectedEntities,
    toEntity,
    connectedEntities,
    connectedEdges,
    linksStatus,
    linksError,
    entityPreviews,
    relationPreviews
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
    const { toEntity, connectedEntities } = this.props;

    // Render loading status and error.
    if (status !== Status.Ok)
      return (
        <Content>
          <Meta status={status} error={error} />
        </Content>
      );

    // Render data
    // We need arrays to preserve the order of the rendered
    // (for accessibilities, among others)
    const rEntities: NodeRenderData[] = [];
    const rRelations: RelationRenderData[] = [];
    // We need objects to quickly access data by key.
    const rEntitiesByKey: { [key: string]: NodeRenderData } = {};
    const rRelationsByKey: { [key: string]: RelationRenderData } = {};

    // Compute initial constants
    const W = 800;
    const H = 800;
    const CX = W / 2;
    const CY = H / 2;
    const minDist = 150;
    const maxDist = W / 2 - minDist - 40;
    const entityCount = connectedEntities.length;
    const maxEdgeCount = entityCount > 0 ? connectedEntities[0][1] : 0;

    // The primary entity
    const primaryEntity = {
      x: CX,
      y: CY,
      entity: getEntityPreview(entity),
      entityKey: baseEntityKey,
      visited: true,
      type: NodeRenderType.Primary
    };
    rEntities.push(primaryEntity);
    rEntitiesByKey[primaryEntity.entityKey] = primaryEntity;

    // Entities directly connected to the primary entity
    let i = 0;
    for (let destEntityKey in toEntity) {
      const edgeCount = toEntity[destEntityKey];
      const angle = -i * ((Math.PI * 2) / entityCount) + Math.PI;
      const distance =
        minDist + ((maxEdgeCount - edgeCount) / maxEdgeCount) * maxDist;
      const x = CX + Math.sin(angle) * distance;
      const y = CY + Math.cos(angle) * distance;
      const rNode: NodeRenderData = {
        entityKey: destEntityKey,
        x,
        y,
        visited: this.props.entitySelection.indexOf(destEntityKey) >= 0,
        type: NodeRenderType.Secondary,
        entity: this.props.entityPreviews[destEntityKey]
      };
      rEntities.push(rNode);
      rEntitiesByKey[rNode.entityKey] = rNode;

      // const relationId = getRelationId(baseEntityKey, destEntityKey) as string;
      // const rRelation: RelationRenderData = {
      //   x1: CX,
      //   y1: CY,
      //   x2: x,
      //   y2: y,
      //   from: baseEntityKey,
      //   to: destEntityKey,
      //   relationId,
      //   types: [] // Will be completed in a second pass.
      // };
      // rRelations.push(rRelation);
      // rRelationsByKey[rRelation.relationId] = rRelation;
      i += 1;
    }

    // Add entities that aren't already linked with the base entity
    const GRID_X_SPACING = 100;
    const GRID_Y_SPACING = 100;
    const GRID_X_COUNT = W / GRID_X_SPACING;
    let j = 0;
    for (let entity of this.props.selectedEntities) {
      // Add only entities that aren't already in the graph
      if (rEntitiesByKey.hasOwnProperty(entity._key as string)) continue;
      const rNode: NodeRenderData = {
        entity: getEntityPreview(entity),
        entityKey: entity._key as string,
        visited: this.props.entitySelection.indexOf(entity._key as string) >= 0,
        type: NodeRenderType.Tertiary,
        x: GRID_X_SPACING * ((j % GRID_X_COUNT) + 0.5),
        y: GRID_Y_SPACING * (~~(j / GRID_X_COUNT) + 0.5)
      };
      rEntities.push(rNode);
      rEntitiesByKey[rNode.entityKey] = rNode;

      j += 1;
    }

    for (const link of this.props.connectedEdges) {
      const relationId = getRelationId(link._from, link._to) as string;
      if (
        rEntitiesByKey.hasOwnProperty(link._from) &&
        rEntitiesByKey.hasOwnProperty(link._to) &&
        !rRelationsByKey[relationId]
      ) {
        const e1 = rEntitiesByKey[link._from];
        const e2 = rEntitiesByKey[link._to];
        const e1Primary = e1.type === NodeRenderType.Primary;
        const e2Primary = e2.type === NodeRenderType.Primary;
        // Filter out secondary relationships of secondary entities
        if (
          link.type === CONSTS.RELATION_TYPES.COMMON_ACTIVITES &&
          !e1Primary &&
          !e2Primary
        )
          continue;

        const rRelation: RelationRenderData = {
          x1: e1.x,
          y1: e1.y,
          x2: e2.x,
          y2: e2.y,
          // Make sure from is the primary entity (for links consistency)
          from: e2Primary ? e2.entityKey : e1.entityKey,
          to: e2Primary ? e1.entityKey : e2.entityKey,
          relationId,
          types: [] // Will be completed in a second pass.
        };
        rRelations.push(rRelation);
        rRelationsByKey[rRelation.relationId] = rRelation;
      }
    }

    // Computes which types need to be rendered
    for (const link of this.props.connectedEdges) {
      const relationId = getRelationId(link._from, link._to) as string;
      if (rRelationsByKey.hasOwnProperty(relationId)) {
        const t = rRelationsByKey[relationId].types;
        if (t.indexOf(link.type) < 0) t.push(link.type);
      }
    }
    // Sort the types simply for consistency across relations.
    for (let r of rRelations) {
      r.types.sort((a, b) => a - b);
    }

    return (
      <Content>
        <Button to={`/${ROUTES.relation}/${baseEntityKey}/${CONSTS.EMPTY_KEY}`}>
          New relation
        </Button>
        {/* <GraphSVG width={W} height={H} xmlns="http://www.w3.org/2000/svg">
          {rRelations.map(rRelation => (
            <Link
              key={rRelation.relationId}
              to={`/${ROUTES.relation}/${rRelation.from}/${rRelation.to}`}
            >
              <GraphLink data={rRelation} />
            </Link>
          ))}
          {rEntities.map(d => (
            <Link key={d.entityKey} to={`/${ROUTES.entity}/${d.entityKey}`}>
              <GraphEntityNode
                entity={d.entity}
                x={d.x}
                y={d.y}
                primary={d.type === NodeRenderType.Primary}
                visited={d.visited}
              />
            </Link>
          ))}
        </GraphSVG> */}
        <GraphD3
          width={W}
          height={H}
          rRelations={rRelations}
          rEntities={rEntities}
        />
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityGraph);
