import { RelationType } from "./types";
import { EntityType as E } from "./types";

// Should have been maintained in sync with the backend here ?
// /backend/service-graph-api/scripts/consts.js

// TODO: Use an Android-R like library to manage this stuff.
export const RELATION_COLORS = {
  [RelationType.IsOwned]: "#e7b300",
  [RelationType.JobDependsOn]: "#ee8012",
  [RelationType.IsControled]: "#a63e14",
  [RelationType.ValueExchange]: "#ffeb00",
  [RelationType.Family]: "#007500",
  [RelationType.Friendship]: "#00b8b8",
  [RelationType.Love]: "#de3d83",
  [RelationType.Opposition]: "#db2f27",
  [RelationType.Influences]: "#f45844",
  [RelationType.Attendance]: "#00b8b8",
  [RelationType.GroupMember]: "#0095a3",
  [RelationType.Other]: "#444444"
};

export const POSSIBLE_LINKS = {
  [RelationType.IsOwned]: [
    [E.MoralPerson, E.Event],
    [E.MoralPerson, E.Group, E.PhysicalPerson]
  ],
  [RelationType.JobDependsOn]: [
    [E.PhysicalPerson],
    [E.MoralPerson, E.Group, E.PhysicalPerson]
  ],
  [RelationType.IsControled]: [
    [E.Group, E.MoralPerson],
    [E.PhysicalPerson, E.MoralPerson, E.Group]
  ],
  [RelationType.ValueExchange]: [
    [E.MoralPerson, E.Group, E.PhysicalPerson],
    [E.MoralPerson, E.Group, E.PhysicalPerson]
  ],
  [RelationType.Family]: [[E.PhysicalPerson], [E.PhysicalPerson]],
  [RelationType.Friendship]: [[E.PhysicalPerson], [E.PhysicalPerson]],
  [RelationType.Love]: [[E.PhysicalPerson], [E.PhysicalPerson]],
  [RelationType.Opposition]: [
    [E.MoralPerson, E.Group, E.PhysicalPerson],
    [E.MoralPerson, E.Group, E.PhysicalPerson]
  ],
  [RelationType.Influences]: [
    [E.MoralPerson, E.Group, E.PhysicalPerson],
    [E.MoralPerson, E.Group, E.PhysicalPerson]
  ],
  [RelationType.Attendance]: [
    [E.MoralPerson, E.Group, E.PhysicalPerson],
    [E.Event]
  ],
  [RelationType.GroupMember]: [[E.MoralPerson, E.PhysicalPerson], [E.Group]],
  [RelationType.Other]: [
    [E.MoralPerson, E.Group, E.PhysicalPerson, E.Event],
    [E.MoralPerson, E.Group, E.PhysicalPerson, E.Event]
  ]
};

export const ERROR_CODES = {
  MISSING_SOURCE_FORM: "MISSING_SOURCE_FORM",
  MISSING_SOURCE_LINK: "MISSING_SOURCE_LINK"
};

const CONSTS = {
  relCollectionName: "relations",
  entCollectionName: "entities",
  EMPTY_KEY: "_",
  RELATION_COLORS,
  ERROR_CODES
};

export default CONSTS;
