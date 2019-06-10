import * as ACTIONS from "../utils/ACTIONS";
import { Source, EntitySelectOption } from "../utils/types";
import { ValueType } from "react-select/lib/types";

export interface SouDescriptionChange {
  type: ACTIONS.SOU_DESCRIPTION_CHANGE;
  namespace: string;
  newDescription: string;
}

export interface SouAuthorsChange {
  type: ACTIONS.SOU_AUTHORS_CHANGE;
  namespace: string;
  selection: ValueType<EntitySelectOption>;
}

export interface SouInitialData {
  type: ACTIONS.SOU_INITIAL_DATA;
  namespace: string;
  data: Source;
}

export interface SouClearData {
  type: ACTIONS.SOU_CLEAR_DATA;
  namespace: string;
}

export type SourceFormAction =
  | SouDescriptionChange
  | SouAuthorsChange
  | SouInitialData
  | SouClearData;

export function souDescriptionChange(
  namespace: string,
  newDescription: string
): SouDescriptionChange {
  return {
    type: ACTIONS.SOU_DESCRIPTION_CHANGE,
    namespace,
    newDescription,
  };
}

export function souAuthorsChange(
  namespace: string,
  selection: ValueType<EntitySelectOption>
): SouAuthorsChange {
  return {
    type: ACTIONS.SOU_AUTHORS_CHANGE,
    namespace,
    selection,
  };
}

export function souInitialData(
  namespace: string,
  data: Source
): SouInitialData {
  return {
    type: ACTIONS.SOU_INITIAL_DATA,
    namespace,
    data,
  };
}

export function souClearData(namespace: string): SouClearData {
  return {
    type: ACTIONS.SOU_CLEAR_DATA,
    namespace,
  };
}
