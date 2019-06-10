import { createSelector } from "reselect";
import { EdgePreview } from "../utils/types";
import { getAllLinks } from "./linksSelector";
import { getEntityKey, getEntityKeys } from "./selectors/propsSelectors";
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
