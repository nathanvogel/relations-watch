import * as ACTIONS from "../utils/ACTIONS";
import { Source, SelectedOption } from "../utils/types";
import { ValueType } from "react-select/lib/types";

export interface SouDescriptionChange {
  type: ACTIONS.SOU_DESCRIPTION_CHANGE;
  namespace: string;
  newDescription: string;
}

export interface SouAuthorsChange {
  type: ACTIONS.SOU_AUTHORS_CHANGE;
  namespace: string;
  selection: ValueType<SelectedOption>;
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

export function souAuthorsChange(
  namespace: string,
  selection: ValueType<SelectedOption>
): SouAuthorsChange {
  return {
    type: ACTIONS.SOU_AUTHORS_CHANGE,
    namespace,
    selection
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
