// A manual copy from /backend/service-graph-api/scripts/consts.js

type RelationType = number;
type RelationTypes = {
  [key: string]: RelationType;
};

const RELATION_TYPES: RelationTypes = {
  OWNS: 1,
  OWNS_A_SHARE: 2,
  ENABLES_A_JOB: 3,
  ENABLES_A_CONTRACT: 4,
  GROUP_MEMBER: 20,
  INFLUENCES_IDEAS: 10,
  FAMILY: 300,
  FRIENDSHIP: 310,
  LOVES: 400,
  HOSTILITY: 410,
  EXCHANGES_VALUES: 100,
  COMMON_ACTIVITES: 110
};

type EntityType = number;
type EntityTypes = {
  [key: string]: EntityType;
};

const ENTITY_TYPES: EntityTypes = {
  PHYSICAL_PERSON: 1,
  MORAL_PERSON: 2,
  EVENT: 10,
  SPECIAL_GROUP: 100
};

export default {
  relCollectionName: "relations",
  entCollectionName: "entities",
  ENTITY_TYPES,
  RELATION_TYPES
};
