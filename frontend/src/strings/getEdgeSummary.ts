import I18n from "../i18n/i18n";
import { Edge, Entity, RelationType as RT, FamilialLink } from "../utils/types";
import R from "./R";

const regularMapping: { [key: number]: string } = {
  [RT.Attendance]: R.relationType_attended,
  [RT.Friendship]: R.relationType_friends,
  [RT.GroupMember]: R.relationType_member,
  [RT.IsInfluenced]: R.relationType_ideas,
  [RT.IsControlled]: R.relationType_controlled,
  [RT.Love]: R.relationType_love,
  [RT.Opposition]: R.relationType_opposition
};

const familyMapping: { [key: number]: string } = {
  [FamilialLink.childOf]: R.relationType_f_child,
  // [FamilialLink.grandchildOf]: R.relationType_f_grandchild,
  [FamilialLink.spouseOf]: R.relationType_f_married,
  [FamilialLink.cousinOf]: R.relationType_f_cousin,
  // [FamilialLink.niblingOf]: R.relationType_f_nibling,
  [FamilialLink.siblingOf]: R.relationType_f_sibling,
  [FamilialLink.other]: R.relationType_f_other
};

export const getEdgeSummary = (
  edge: Edge,
  entityFrom: Entity,
  entityTo: Entity
) => {
  const names = {
    nameFrom: entityFrom.name,
    nameTo: entityTo.name
  };
  const amount = edge.amount;
  const percent = edge.owned;
  switch (edge.type) {
    case RT.IsOwned:
      return I18n.t(R.relationType_owned_p, { ...names, percent });
    case RT.JobDependsOn:
      if (edge.amount === undefined || edge.amount < 0)
        return I18n.t(R.relationType_jobDep, names);
      else if (edge.exactAmount)
        return I18n.t(R.relationType_jobDep_eA, { ...names, amount });
      else return I18n.t(R.relationType_jobDep_A, { ...names, amount });
    case RT.ValueExchange:
      if (edge.amount === undefined || edge.amount < 0)
        return I18n.t(R.relationType_traded, names);
      else if (edge.exactAmount)
        return I18n.t(R.relationType_traded_eA, { ...names, amount });
      else return I18n.t(R.relationType_traded_A, { ...names, amount });
    case RT.Family:
      return I18n.t(familyMapping[edge.fType as FamilialLink], names);
    case RT.Other:
      return ""; // the description should be the main text then
    default:
      return I18n.t(regularMapping[edge.type], names);
  }
};
