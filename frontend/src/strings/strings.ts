import { EntityType, RelationType, FamilialLink } from "../utils/types";
import R from "./R";

type StringMapping = {
  [key: number]: string;
};

export const RelationTypeMapping: StringMapping = {
  [RelationType.IsOwned]: R.relation_type_owned,
  [RelationType.JobDependsOn]: R.relation_type_job,
  [RelationType.IsControlled]: R.relation_type_controlled,
  [RelationType.ValueExchange]: R.relation_type_traded,
  [RelationType.Family]: R.relation_type_family,
  [RelationType.Love]: R.relation_type_love,
  [RelationType.Opposition]: R.relation_type_opposition,
  [RelationType.IsInfluenced]: R.relation_type_ideas,
  [RelationType.Attendance]: R.relation_type_attended,
  [RelationType.GroupMember]: R.relation_type_member,
  [RelationType.Other]: R.relation_type_other,
};

export const LegendRelationTypeMapping: StringMapping = {
  [RelationType.IsOwned]: R.legend_relation_type_owned,
  [RelationType.JobDependsOn]: R.legend_relation_type_job,
  [RelationType.IsControlled]: R.legend_relation_type_controlled,
  [RelationType.ValueExchange]: R.legend_relation_type_traded,
  [RelationType.Family]: R.legend_relation_type_family,
  [RelationType.Love]: R.legend_relation_type_love,
  [RelationType.Opposition]: R.legend_relation_type_opposition,
  [RelationType.IsInfluenced]: R.legend_relation_type_ideas,
  [RelationType.Attendance]: R.legend_relation_type_attended,
  [RelationType.GroupMember]: R.legend_relation_type_member,
  [RelationType.Other]: R.legend_relation_type_other,
};

export const FamilialLinkMapping: StringMapping = {
  [FamilialLink.childOf]: R.familial_link_type_child,
  [FamilialLink.siblingOf]: R.familial_link_type_sibling,
  [FamilialLink.spouseOf]: R.familial_link_type_spouse,
  // [FamilialLink.grandchildOf]: "is a grandchild of",
  // [FamilialLink.cousinOf]: "is a cousin of",
  // [FamilialLink.niblingOf]: "is a nibling of",
  [FamilialLink.other]: R.familial_link_type_other,
};

export const EntityTypeMapping: StringMapping = {
  [EntityType.Human]: R.entity_type_human,
  [EntityType.MoralPerson]: R.entity_type_moral_person,
  [EntityType.State]: R.entity_type_state,
  [EntityType.Media]: R.entity_type_media,
  [EntityType.Group]: R.entity_type_group,
  [EntityType.Event]: R.entity_type_event,
};
