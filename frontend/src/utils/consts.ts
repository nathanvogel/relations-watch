// Should have been maintained in sync with the backend here ?
// /backend/service-graph-api/scripts/consts.js

// TODO: convert this mess to enums
type RelationType = number;
type RelationTypes = {
  [key: string]: RelationType;
};
const RELATION_TYPES: RelationTypes = {
  OWNS: 1,
  OWNS_A_SHARE: 2,
  ENABLES_A_JOB: 3,
  ENABLES_A_CONTRACT: 4,
  WORKS_FOR: 5,
  GROUP_MEMBER: 20,
  INFLUENCES_IDEAS: 10,
  FAMILY: 300,
  FRIENDSHIP: 310,
  LOVES: 400,
  HOSTILITY: 410,
  EXCHANGES_VALUES: 100,
  ATTENDED: 1000,
  COMMON_ACTIVITES: 110
};

// TODO: Use an Android-R like library to manage this stuff.
export const RELATION_COLORS = {
  [RELATION_TYPES.OWNS]: "#e7b300",
  [RELATION_TYPES.OWNS_A_SHARE]: "#fbae17",
  [RELATION_TYPES.ENABLES_A_JOB]: "#ee8012",
  [RELATION_TYPES.ENABLES_A_CONTRACT]: "#a63e14",
  [RELATION_TYPES.WORKS_FOR]: "#a63e14",
  [RELATION_TYPES.GROUP_MEMBER]: "#0095a3",
  [RELATION_TYPES.INFLUENCES_IDEAS]: "#f45844",
  [RELATION_TYPES.FAMILY]: "#007500",
  [RELATION_TYPES.FRIENDSHIP]: "#00b8b8",
  [RELATION_TYPES.LOVES]: "#de3d83",
  [RELATION_TYPES.HOSTILITY]: "#db2f27",
  [RELATION_TYPES.EXCHANGES_VALUES]: "#ffeb00",
  [RELATION_TYPES.ATTENDED]: "#00b8b8",
  [RELATION_TYPES.COMMON_ACTIVITES]: "#08327d"
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
  RELATION_TYPES,
  ERROR_CODES
};

export default CONSTS;
