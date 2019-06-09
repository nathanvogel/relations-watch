import { createSelector } from "reselect";
import { EdgePreview } from "../utils/types";
import * as ok from "./entitiesSelector";
import { getAllLinks } from "./linksSelector";

//  Necessary to put in another file to avoid circular depencies

export const getConnectedEdges = createSelector(
  [ok.getEntityKey, getAllLinks],
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
