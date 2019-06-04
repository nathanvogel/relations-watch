import React, { Component } from "react";
import styled from "styled-components";

import {
  V4LinkDatum,
  V4NodeDatum,
  EdgePreview,
  NodeRenderType,
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
  EntityPreview,
} from "../utils/types";
import {
  getRelationId,
  getNewDirection,
  isDirectedType,
  arrayWithoutDuplicates,
} from "../utils/utils";
import GraphV4 from "./GraphV4";
import Measure from "react-measure";

const Content = styled.div`
  width: 100vw;
  height: calc(100vh - ${props => props.theme.navBarHeight});
  max-width: 100vw;
  max-height: calc(100vh - ${props => props.theme.navBarHeight});
  overflow: auto;
`;

type Props = {
  entities: { [entityKey: string]: EntityPreview };
  edges: { [edgeKey: string]: EdgePreview };
  /**
   * Absence of key or false value indicates that it's not selected.
   */
  entitySelection: { [entityKey: string]: boolean };
  /**
   * Used to pin entities, indicate if they're primary, etc.
   */
  specialEntities: {
    [entityKey: string]: {
      x: number;
      y: number;
      type: NodeRenderType;
    };
  };
  network: boolean;
};

class GraphPreparator extends Component<Props> {
  render() {
    const { entities, edges, entitySelection, specialEntities } = this.props;

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
      // TODO: Check
      // delete e.x;
      // delete e.y;
      rEntities.push(e);
      rEntitiesByKey[e.entityKey] = e;
    };
    const addRel = (e: V4LinkDatum) => {
      rRelations.push(e);
      rRelationsByKey[e.relationId] = e;
    };

    // Compute initial constants

    // The primary entity
    // const primaryEntity: V4NodeDatum = {
    //   entity: getEntityPreview(entity),
    //   type: NodeRenderType.Primary,
    //   sortedZones: [RelZone.Main],
    // };
    // addEntity(primaryEntity);

    for (let key in entities) {
      const rNode: V4NodeDatum = {
        x: Math.random() * 500,
        y: Math.random() * 500,
        radius: 40,
        entityKey: key,
        visited: entitySelection[key],
        type: specialEntities[key]
          ? specialEntities[key].type
          : NodeRenderType.Secondary,
        entity: entities[key],
        zones: Object.assign({}, DefaultZones),
        zoneTotal: 0,
        sortedZones:
          specialEntities[key] && specialEntities[key].type
            ? [RelZone.Main]
            : [],
        connectedEntities: new Set(),
      };
      addEntity(rNode);
    }

    for (const edgeKey in edges) {
      const link = edges[edgeKey];
      const relationId = getRelationId(link._from, link._to) as string;
      if (
        !rEntitiesByKey.hasOwnProperty(link._from) ||
        !rEntitiesByKey.hasOwnProperty(link._to)
      )
        continue;

      const e1 = rEntitiesByKey[link._from];
      const e2 = rEntitiesByKey[link._to];
      const relType =
        e1.type === NodeRenderType.Primary || e2.type === NodeRenderType.Primary
          ? NodeRenderType.Primary
          : NodeRenderType.Secondary;
      const e1IsRoot = e1.type < e2.type;
      const sourceKey = (e1IsRoot ? e1 : e2).entityKey;
      const targetKey = (e1IsRoot ? e2 : e1).entityKey;
      e1.connectedEntities.add(e2.entityKey);
      e2.connectedEntities.add(e1.entityKey);

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
        fTypes: [],
      };
      addRel(rRelation);
    }

    // Compute zones and weights for edges
    for (const edgeKey in edges) {
      const link = edges[edgeKey];
      const relationId = getRelationId(link._from, link._to) as string;
      const rRelation = rRelationsByKey[relationId];
      const invertDirection = link._from === rRelation.source;
      let proximityWeight = 0;
      if (!rRelation) continue;
      if (link.type === RelationType.Family) {
        // special family case
        // Compute the "zone correspondance" score for the entity.
        rEntitiesByKey[rRelation.targetKey].zones[RelZone.IsRelated] += 1;
        rEntitiesByKey[rRelation.targetKey].zoneTotal += 1;
        // Compute the proximity score for the relation
        // and makes sure we have a defined weight for this type of relationship
        proximityWeight =
          link.fType && FProximityWeights.hasOwnProperty(link.fType)
            ? FProximityWeights[link.fType]
            : 1;
        if (link.fType) rRelation.fTypes.push(link.fType);
      } else {
        // Compute the "zone correspondance" score for the entity.
        const [zone, weight] = TypeWeights[link.type][
          invertDirection ? "nor" : "inv"
        ];
        rEntitiesByKey[rRelation.targetKey].zones[zone] += weight;
        rEntitiesByKey[rRelation.targetKey].zoneTotal += weight;
        // Compute the proximity score for the relation
        // and makes sure we have a defined weight for this type of relationship
        proximityWeight =
          link.type && ProximityWeights.hasOwnProperty(link.type)
            ? ProximityWeights[link.type]
            : 0.3;
      }
      rRelation.proximity += proximityWeight;
      rRelation.tWeights[link.type] += proximityWeight;
      // Compute the new direction(s)
      if (isDirectedType(link.type, link.fType)) {
        rRelation.tDirections[link.type] = getNewDirection(
          rRelation.tDirections[link.type],
          invertDirection ? LinkDir.Invert : LinkDir.Normal
        );
      }
    }

    // Normalize zones weight across each single entity.
    for (let rEntity of rEntities) {
      // avoid divide by zero
      if (!rEntity.zoneTotal) continue;
      for (let zoneKey of RelZoneValues) {
        rEntity.zones[zoneKey] /= rEntity.zoneTotal;
      }
      // Commpute an array of all the zones, but sorted by score.
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
      // Sort family types
      rRelation.fTypes = arrayWithoutDuplicates(rRelation.fTypes).sort(
        (a, b) => b - a // will give the order child/sibling/spouse/other
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
              network={this.props.network}
            />
          </Content>
        )}
      </Measure>
    );
  }
}

export default GraphPreparator;
