import CONSTS from "../utils/consts";

type MyStringRes = {
  [key: string]: string;
};

export const RELATION_TYPES_STRRES: MyStringRes = {
  OWNS: "owns",
  OWNS_A_SHARE: "owns a share of",
  GROUP_MEMBER: "is a group member of",
  ENABLES_A_JOB: "enables a job for",
  ENABLES_A_CONTRACT: "enables a contract for",
  INFLUENCES_IDEAS: "influences the ideas of",
  FAMILY: "Family",
  FRIENDSHIP: "Friends",
  LOVES: "Love",
  HOSTILITY: "Hostitily",
  COMMON_ACTIVITES: "did something with",
  EXCHANGES_VALUES: "traded with"
};

export const RELATION_TYPES_STR = {
  [CONSTS.RELATION_TYPES.OWNS]: "owns",
  [CONSTS.RELATION_TYPES.OWNS_A_SHARE]: "owns a share of",
  [CONSTS.RELATION_TYPES.GROUP_MEMBER]: "is a group member of",
  [CONSTS.RELATION_TYPES.ENABLES_A_JOB]: "enables a job for",
  [CONSTS.RELATION_TYPES.ENABLES_A_CONTRACT]: "enables a contract for",
  [CONSTS.RELATION_TYPES.INFLUENCES_IDEAS]: "influences the ideas of",
  [CONSTS.RELATION_TYPES.FAMILY]: "Family",
  [CONSTS.RELATION_TYPES.FRIENDSHIP]: "Friends",
  [CONSTS.RELATION_TYPES.LOVES]: "Love",
  [CONSTS.RELATION_TYPES.HOSTILITY]: "Hostitily",
  [CONSTS.RELATION_TYPES.COMMON_ACTIVITES]: "did something with",
  [CONSTS.RELATION_TYPES.EXCHANGES_VALUES]: "traded with"
};

export const ENTITY_TYPES: MyStringRes = {
  PHYSICAL_PERSON: "Natural person",
  MORAL_PERSON: "Moral person",
  EVENT: "Event",
  SPECIAL_GROUP: "Group"
};
