import { EntityType, RelationType, FamilialLink } from "../utils/types";

type StringTypeRes = {
  [key: number]: string;
};

export const RELATION_TYPES_STR: StringTypeRes = {
  [RelationType.IsOwned]: "is owned by",
  [RelationType.JobDependsOn]: "works for",
  [RelationType.IsControled]: "is controled by",
  [RelationType.ValueExchange]: "traded with",
  [RelationType.Family]: "Family",
  [RelationType.Friendship]: "Friends",
  [RelationType.Love]: "Love",
  [RelationType.Opposition]: "Opposition",
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

export const FAMILIAL_LINK_STR: StringTypeRes = {
  [FamilialLink.childOf]: "is a child of",
  [FamilialLink.siblingOf]: "is a sibling of",
  [FamilialLink.spouseOf]: "is married with",
  [FamilialLink.grandchildOf]: "is a grandchild of",
  [FamilialLink.cousinOf]: "is a cousin of",
  [FamilialLink.niblingOf]: "is a nibling of",
  [FamilialLink.other]: "Other"
};
