import { EntityType, RelationType, FamilialLink } from "../utils/types";
import R from "./R";

type StringTypeRes = {
  [key: number]: string;
};

export const RELATION_TYPES_STR: StringTypeRes = {
  [RelationType.IsOwned]: R.legend_relationType_owned,
  [RelationType.JobDependsOn]: R.legend_relationType_jobDep,
  [RelationType.IsControlled]: R.legend_relationType_controlled,
  [RelationType.ValueExchange]: R.legend_relationType_traded,
  [RelationType.Family]: R.legend_relationType_family,
  [RelationType.Love]: R.legend_relationType_love,
  [RelationType.Opposition]: R.legend_relationType_opposition,
  [RelationType.IsInfluenced]: R.legend_relationType_ideas,
  [RelationType.Attendance]: R.legend_relationType_attended,
  [RelationType.GroupMember]: R.legend_relationType_member,
  [RelationType.Other]: R.legend_relationType_other,
};

export const ENTITY_TYPES: StringTypeRes = {
  [EntityType.Human]: "Person",
  [EntityType.MoralPerson]: "Moral person",
  [EntityType.Event]: "Event",
  [EntityType.Group]: "Group",
  [EntityType.State]: "State",
  [EntityType.Media]: "Media",
};

export const FAMILIAL_LINK_STR: StringTypeRes = {
  [FamilialLink.childOf]: "is a child of",
  [FamilialLink.siblingOf]: "is a sibling of",
  [FamilialLink.spouseOf]: "is married with",
  // [FamilialLink.grandchildOf]: "is a grandchild of",
  [FamilialLink.cousinOf]: "is a cousin of",
  // [FamilialLink.niblingOf]: "is a nibling of",
  [FamilialLink.other]: "Other",
};
