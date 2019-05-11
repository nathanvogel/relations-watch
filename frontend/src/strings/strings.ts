import CONSTS from "../utils/consts";
import { EntityType, RelationType } from "../utils/types";

type StringRes = {
  [key: string]: string;
};

type StringTypeRes = {
  [key: number]: string;
};

export const RELATION_TYPES_STR: StringTypeRes = {
  [RelationType.IsOwned]: "is owned by",
  [RelationType.JobDependsOn]: "'s job depends on",
  [RelationType.IsControled]: "is controled by",
  [RelationType.ValueExchange]: "traded with",
  [RelationType.Family]: "Family",
  [RelationType.Friendship]: "Friends",
  [RelationType.Love]: "Love",
  [RelationType.Opposition]: "Adversary",
  [RelationType.Influences]: "influences the ideas of",
  [RelationType.Attendance]: "attended",
  [RelationType.GroupMember]: "is a group member of",
  [RelationType.Other]: "Other"
};

export const ENTITY_TYPES: StringTypeRes = {
  [EntityType.PhysicalPerson]: "Natural person",
  [EntityType.MoralPerson]: "Moral person",
  [EntityType.Event]: "Event",
  [EntityType.Group]: "Group"
};
