import { RootStore } from "../Store";
import { createSelector } from "reselect";
import { EntityPreview, EdgePreview, NodeRenderType } from "../utils/types";
import { getAllLinks } from "./linksSelector";

export const getEntityPreviews = (state: RootStore) =>
  state.entities.datapreview;

interface Props {
  entityKey: string;
}

export const getEntityKey = (_: RootStore, props: Props) => props.entityKey;

export const getDefaultSpecialEntityFromMain = createSelector(
  [getEntityKey],
  entityKey => {
    return {
      [entityKey]: {
        x: 0.5,
        y: 0.5,
        type: NodeRenderType.Primary,
      },
    };
  }
);

/**
 * Memoize the results, so it will only be called if links or entities
 * are changed or added. Which might still be too often, since those links
 * are later filtered, but it's already good.
 * Could be combined into one function with getConnectedEdges, if the
 * performance cost of iterating twice over allLinks (which could get
 * fairly large) becomes too big.
 */
export const getConnectedEntities = createSelector(
  [getEntityKey, getEntityPreviews, getAllLinks],
  (entityKey, allEntityPreviews, allLinks) => {
    const entities: { [entityKey: string]: EntityPreview } = {};
    const edges: { [edgeKey: string]: EdgePreview } = {};

    const addEntity = (key: string) => {
      // Don't re-add entities
      if (entities[key]) return;
      const tmp = allEntityPreviews[key];
      if (tmp) entities[key] = tmp;
      else console.warn("No data for", key);
    };

    // Render the main entity even if links aren't loaded yet.
    addEntity(entityKey);

    for (let edgeKey in allLinks) {
      const edge = allLinks[edgeKey];
      if (edge._from === entityKey || edge._to === entityKey) {
        edges[edgeKey] = edge;
        addEntity(edge._from);
        addEntity(edge._to);
      }
    }

    return entities;
  }
);
