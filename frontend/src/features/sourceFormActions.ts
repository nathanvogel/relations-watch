import * as ACTIONS from "../utils/ACTIONS";
import { NamespacedAction, RootAction } from "../utils/ACTIONS";
import { Source } from "../utils/types";

export interface SouDescriptionChange {
  type: ACTIONS.SOU_DESCRIPTION_CHANGE;
  namespace: string;
  newDescription: string;
}

export interface SouAuthorsChange {
  type: ACTIONS.SOU_AUTHORS_CHANGE;
  namespace: string;
}

export interface SouInitialData {
  type: ACTIONS.SOU_INITIAL_DATA;
  namespace: string;
  data: Source;
}

export type SourceFormAction =
  | SouDescriptionChange
  | SouAuthorsChange
  | SouInitialData;

export function souDescriptionChange(
  namespace: string,
  newDescription: string
): SouDescriptionChange {
  return {
    type: ACTIONS.SOU_DESCRIPTION_CHANGE,
    namespace,
    newDescription
  };
}

export function souAuthorsChange(namespace: string): SouAuthorsChange {
  return {
    type: ACTIONS.SOU_AUTHORS_CHANGE,
    namespace
  };
}

export function souInitialData(
  namespace: string,
  data: Source
): SouInitialData {
  return {
    type: ACTIONS.SOU_INITIAL_DATA,
    namespace,
    data
  };
}
