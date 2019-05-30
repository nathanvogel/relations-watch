import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import { Link } from "react-router-dom";

import { RootStore } from "../Store";
import { loadEntity } from "../features/entitiesLoadAC";
import ROUTES from "../utils/ROUTES";
import Meta from "../components/meta/Meta";
import {
  Status,
  V4LinkDatum,
  V4NodeDatum,
  EdgePreview,
  NodeRenderType as RenderType,
  RelationType,
  RelZone,
  DefaultZones,
  DefaultTypeDirs,
  TypeWeights,
  FProximityWeights,
  ProximityWeights,
  RelZoneValues,
  DefaultTypeWeights,
  RelationTypeValues,
  LinkDir,
} from "../utils/types";
import { loadEntityGraph } from "../features/linksLoadAC";
import {
  getEntityPreview,
  getRelationId,
  getNewDirection,
  isDirectedType,
} from "../utils/utils";
import GraphV4 from "./GraphV4";
import Measure, { ContentRect } from "react-measure";

const Content = styled.div`
  width: 100vw;
  height: calc(100vh - ${props => props.theme.navBarHeight});
  max-width: 100vw;
  max-height: calc(100vh - ${props => props.theme.navBarHeight});
  overflow: auto;
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

  const connectedEdges: EdgePreview[] = [];
  if (state.links.data.byentity[baseEntityKey])
    connectedEdges.push(...state.links.data.byentity[baseEntityKey].edges);
  const linksStatus = state.links.status[baseEntityKey];
  const linksError = state.links.errors[baseEntityKey];

  const entityPreviews = state.entities.datapreview;
  const relationPreviews = state.links.data.byrelation;

  const entitySelection = state.entitySelection;
  /*
  const selectedEntities = entitySelection
    .map(entityKey => state.entities.data[entityKey])
    .filter(entity => Boolean(entity));
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
    if (!entity || !entity._key || !state.links.data.byentity[entity._key])
      continue;
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
  */

  // Return everything.
  return {
    baseEntityKey,
    entity,
    status,
    error,
    entitySelection,
    // selectedEntities,
    toEntity,
    connectedEdges,
    linksStatus,
    linksError,
    entityPreviews,
    relationPreviews,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      loadEntity,
      loadEntityGraph,
    },
    dispatch
  );

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class EntityGraphV4 extends Component<Props> {
  componentDidMount() {
    // if (!this.props.status || this.props.status === Status.Error)
    //   this.props.loadEntity(this.props.baseEntityKey);
    // if (!this.props.linksStatus || this.props.linksStatus === Status.Error)
    //   this.props.loadEntityGraph(this.props.baseEntityKey);
  }

  render() {
    const { entity, status, error, baseEntityKey } = this.props;
    const { toEntity } = this.props;

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
    const rEntities: V4NodeDatum[] = [];
    const rRelations: V4LinkDatum[] = [];
    // We need objects to quickly access data by key.
    const rEntitiesByKey: { [key: string]: V4NodeDatum } = {};
    const rRelationsByKey: { [key: string]: V4LinkDatum } = {};

    const addEntity = (e: V4NodeDatum) => {
      // Hack to avoid re-initing position
      delete e.x;
      delete e.y;
      rEntities.push(e);
      rEntitiesByKey[e.entityKey] = e;
    };
    const addRel = (e: V4LinkDatum) => {
      rRelations.push(e);
      rRelationsByKey[e.relationId] = e;
    };

    // Compute initial constants

    // The primary entity
    const primaryEntity: V4NodeDatum = {
      x: Math.random() * 500,
      y: Math.random() * 500,
      radius: 40,
      entity: getEntityPreview(entity),
      entityKey: baseEntityKey,
      visited: true,
      type: RenderType.Primary,
      zones: Object.assign({}, DefaultZones),
      zoneTotal: 0,
      sortedZones: [RelZone.Main],
    };
    addEntity(primaryEntity);

    // Entities directly connected to the primary entity
    for (let destEntityKey in toEntity) {
      const rNode: V4NodeDatum = {
        x: Math.random() * 500,
        y: Math.random() * 500,
        radius: 40,
        entityKey: destEntityKey,
        visited: this.props.entitySelection.indexOf(destEntityKey) >= 0,
        type: RenderType.Secondary,
        entity: this.props.entityPreviews[destEntityKey],
        zones: Object.assign({}, DefaultZones),
        zoneTotal: 0,
        sortedZones: [],
      };
      addEntity(rNode);
    }

    for (const link of this.props.connectedEdges) {
      const relationId = getRelationId(link._from, link._to) as string;
      if (
        !rEntitiesByKey.hasOwnProperty(link._from) ||
        !rEntitiesByKey.hasOwnProperty(link._to)
      )
        continue;

      const e1 = rEntitiesByKey[link._from];
      const e2 = rEntitiesByKey[link._to];
      const relType =
        e1.type === RenderType.Primary || e2.type === RenderType.Primary
          ? RenderType.Primary
          : RenderType.Secondary;
      const e1IsRoot = e1.type < e2.type;
      const sourceKey = (e1IsRoot ? e1 : e2).entityKey;
      const targetKey = (e1IsRoot ? e2 : e1).entityKey;

      // Filter out secondary relationships of secondary entities
      if (
        (link.type === RelationType.Other ||
          link.type === RelationType.ValueExchange ||
          link.type === RelationType.Attendance) &&
        relType !== RenderType.Primary
      )
        continue;

      const rRelation: V4LinkDatum = {
        sourceKey,
        targetKey,
        source: sourceKey,
        target: targetKey,
        relationId,
        withType: relType,
        visited: e1.visited && e2.visited,
        proximity: 0,
        tDirections: Object.assign({}, DefaultTypeDirs),
        tWeights: Object.assign({}, DefaultTypeWeights),
        sortedTypes: [],
      };
      addRel(rRelation);
    }

    for (const link of this.props.connectedEdges) {
      const relationId = getRelationId(link._from, link._to) as string;
      const rRelation = rRelationsByKey[relationId];
      if (!rRelation) continue;
      if (link.type === RelationType.Family) {
        // special family case
        // Compute the "zone correspondance" score for the entity.
        rEntitiesByKey[rRelation.targetKey].zones[RelZone.IsRelated] += 1;
        rEntitiesByKey[rRelation.targetKey].zoneTotal += 1;
        // Compute the proximity score for the relation
        // and makes sure we have a defined weight for this type of relationship
        const proximityWeight =
          link.fType && FProximityWeights.hasOwnProperty(link.fType)
            ? FProximityWeights[link.fType]
            : 1;
        rRelation.proximity += proximityWeight;
        rRelation.tWeights[link.type] += proximityWeight;
      } else {
        const invertDirection = link._from === rRelation.source;
        // Compute the "zone correspondance" score for the entity.
        const [zone, weight] = TypeWeights[link.type][
          invertDirection ? "nor" : "inv"
        ];
        rEntitiesByKey[rRelation.targetKey].zones[zone] += weight;
        rEntitiesByKey[rRelation.targetKey].zoneTotal += weight;
        // Compute the proximity score for the relation
        // and makes sure we have a defined weight for this type of relationship
        const proximityWeight =
          link.type && ProximityWeights.hasOwnProperty(link.type)
            ? ProximityWeights[link.type]
            : 0.3;
        rRelation.proximity += proximityWeight;
        rRelation.tWeights[link.type] += proximityWeight;
        // Compute the new direction(s)
        if (isDirectedType(link.type)) {
          rRelation.tDirections[link.type] = getNewDirection(
            rRelation.tDirections[link.type],
            invertDirection ? LinkDir.Invert : LinkDir.Normal
          );
        }
      }
    }

    // Normalize zones weight across each single entity.
    for (let rEntity of rEntities) {
      // avoid divide by zero
      if (!rEntity.zoneTotal) continue;
      for (let zoneKey of RelZoneValues) {
        rEntity.zones[zoneKey] /= rEntity.zoneTotal;
      }
      rEntity.sortedZones = RelZoneValues.map(relZone => relZone).sort(
        (a, b) => rEntity.zones[b] - rEntity.zones[a]
      );
    }

    // Compute sorted types
    for (let rRelation of rRelations) {
      for (let t of RelationTypeValues) {
        if (rRelation.tWeights[t]) rRelation.sortedTypes.push(t);
      }
      rRelation.sortedTypes = rRelation.sortedTypes.sort(
        (a, b) => rRelation.tWeights[b] - rRelation.tWeights[a]
      );
    }

    return (
      <Measure client={true} offset={false}>
        {({ measureRef, contentRect }) => (
          <Content ref={measureRef}>
            <GraphV4
              width={
                contentRect.client
                  ? Math.max(contentRect.client.width || 500, 500)
                  : 800
              }
              height={
                contentRect.client
                  ? Math.max(contentRect.client.height || 500, 500)
                  : 800
              }
              rRelations={rRelations}
              rEntities={rEntities}
              rRelationsByKey={rRelationsByKey}
              rEntitiesByKey={rEntitiesByKey}
            />
          </Content>
        )}
      </Measure>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityGraphV4);
