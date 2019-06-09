import { RootStore } from "../Store";
import { objectFromArray } from "../utils/utils";
import { createSelector } from "reselect";

export const getEntitySelection = (state: RootStore) => state.entitySelection;

export const getSelectedEntitiesObj = createSelector(
  [getEntitySelection],
  entitySelection => {
    return objectFromArray(entitySelection);
  }
);
