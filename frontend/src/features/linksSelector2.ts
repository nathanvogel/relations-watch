import { createSelector } from "reselect";
import { EdgePreview } from "../utils/types";
import { getAllLinks } from "./linksSelector";
import {
  getEntityKey,
  getEntity1Key,
  getEntity2Key,
} from "./selectors/propsSelectors";
import { getSomeEntityPreviews } from "./entitiesSelector";

//  Necessary to put in another file to avoid circular depencies

export const getConnectedEdges = createSelector(
  [getEntityKey, getAllLinks],
  (entityKey, allLinks) => {
    const edges: { [edgeKey: string]: EdgePreview } = {};

    for (let edgeKey in allLinks) {
      const edge = allLinks[edgeKey];
      if (edge._from === entityKey || edge._to === entityKey) {
        edges[edgeKey] = edge;
      }
    }

    return edges;
  }
);

const defaultEdges: { [edgeKey: string]: EdgePreview } = {};

export const getInbetweenEdges = createSelector(
  [getEntity1Key, getEntity2Key, getAllLinks],
  (entity1Key, entity2Key, allLinks) => {
    const edges: { [edgeKey: string]: EdgePreview } = {};
    if (!entity1Key || !entity2Key) return defaultEdges;

    for (let edgeKey in allLinks) {
      const edge = allLinks[edgeKey];
      if (
        (edge._from === entity1Key && edge._to === entity2Key) ||
        (edge._to === entity1Key && edge._from === entity2Key)
      ) {
        edges[edgeKey] = edge;
      }
    }

    return edges;
  }
);

export const getConnectingEdges = createSelector(
  [getSomeEntityPreviews, getAllLinks],
  (entities, allLinks) => {
    const edges: { [edgeKey: string]: EdgePreview } = {};

    // Extract all links between all entities
    for (let edgeKey in allLinks) {
      const edge = allLinks[edgeKey];
      if (entities[edge._from] && entities[edge._to]) {
        edges[edgeKey] = edge;
      }
    }

    return edges;
  }
);
