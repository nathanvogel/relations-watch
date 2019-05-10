import CONSTS from "../utils/consts";
import { EntityType } from "../utils/types";

type StringRes = {
  [key: string]: string;
};

type StringTypeRes = {
  [key: number]: string;
};

export const RELATION_TYPES_STRRES: StringRes = {
  OWNS: "owns",
  OWNS_A_SHARE: "owns a share of",
  GROUP_MEMBER: "is a group member of",
  ENABLES_A_JOB: "could fire/has hired",
  ENABLES_A_CONTRACT: "enables a contract for",
  WORKS_FOR: "works for",
  INFLUENCES_IDEAS: "influences the ideas of",
  FAMILY: "Family",
  FRIENDSHIP: "Friends",
  LOVES: "Love",
  HOSTILITY: "Adversary",
  COMMON_ACTIVITES: "did something with",
  ATTENDED: "attended",
  EXCHANGES_VALUES: "traded with"
};

export const RELATION_TYPES_STR = {
  [CONSTS.RELATION_TYPES.OWNS]: "owns",
  [CONSTS.RELATION_TYPES.OWNS_A_SHARE]: "owns a share of",
  [CONSTS.RELATION_TYPES.GROUP_MEMBER]: "is a group member of",
  [CONSTS.RELATION_TYPES.ENABLES_A_JOB]: "could fire/has hired",
  [CONSTS.RELATION_TYPES.ENABLES_A_CONTRACT]: "enables a contract for",
  [CONSTS.RELATION_TYPES.WORKS_FOR]: "works for",
  [CONSTS.RELATION_TYPES.INFLUENCES_IDEAS]: "influences the ideas of",
  [CONSTS.RELATION_TYPES.FAMILY]: "Family",
  [CONSTS.RELATION_TYPES.FRIENDSHIP]: "Friends",
  [CONSTS.RELATION_TYPES.LOVES]: "Love",
  [CONSTS.RELATION_TYPES.HOSTILITY]: "Adversary",
  [CONSTS.RELATION_TYPES.COMMON_ACTIVITES]: "did something with",
  [CONSTS.RELATION_TYPES.ATTENDED]: "attended",
  [CONSTS.RELATION_TYPES.EXCHANGES_VALUES]: "traded with"
};

export const TypeOptions = Object.keys(CONSTS.RELATION_TYPES).map(key => ({
  value: CONSTS.RELATION_TYPES[key],
  label: RELATION_TYPES_STRRES[key]
}));

export const ENTITY_TYPES: StringTypeRes = {
  [EntityType.PhysicalPerson]: "Natural person",
  [EntityType.MoralPerson]: "Moral person",
  [EntityType.Event]: "Event",
  [EntityType.Group]: "Group"
};
