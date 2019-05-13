import {
  RelationType,
  RelationTypeOption,
  RelationTypeValues,
  FamilialLinkOption,
  FamilialLinkValues,
  RelationTypeRequirements,
  AmountSelectOption,
  EntityTypeOption,
  EntityTypeValues
} from "./types";
import { EntityType as E } from "./types";
import {
  RELATION_TYPES_STR,
  FAMILIAL_LINK_STR,
  ENTITY_TYPES
} from "../strings/strings";

// Should have been maintained in sync with the backend here ?
// /backend/service-graph-api/scripts/consts.js

export const POSSIBLE_LINKS = {
  [RelationType.IsOwned]: [
    [E.MoralPerson, E.Event],
    [E.MoralPerson, E.Group, E.Human]
  ],
  [RelationType.JobDependsOn]: [
    [E.Human, E.MoralPerson],
    [E.MoralPerson, E.Group, E.Human]
  ],
  [RelationType.IsControlled]: [
    [E.Group, E.MoralPerson],
    [E.Human, E.MoralPerson, E.Group]
  ],
  [RelationType.ValueExchange]: [
    [E.MoralPerson, E.Group, E.Human],
    [E.MoralPerson, E.Group, E.Human]
  ],
  [RelationType.Family]: [[E.Human], [E.Human]],
  [RelationType.Friendship]: [[E.Human], [E.Human]],
  [RelationType.Love]: [[E.Human], [E.Human]],
  [RelationType.Opposition]: [
    [E.MoralPerson, E.Group, E.Human],
    [E.MoralPerson, E.Group, E.Human]
  ],
  [RelationType.Influences]: [
    [E.MoralPerson, E.Group, E.Human],
    [E.MoralPerson, E.Group, E.Human]
  ],
  [RelationType.Attendance]: [[E.MoralPerson, E.Group, E.Human], [E.Event]],
  [RelationType.GroupMember]: [[E.MoralPerson, E.Human], [E.Group]],
  [RelationType.Other]: [
    [E.MoralPerson, E.Group, E.Human, E.Event],
    [E.MoralPerson, E.Group, E.Human, E.Event]
  ]
};

type Requirements = {
  [key: number]: RelationTypeRequirements;
};
export const RELATION_REQUIREMENTS: Requirements = {
  [RelationType.IsOwned]: { ownedPercent: true },
  [RelationType.JobDependsOn]: { amount: true, descriptionRequired: true },
  [RelationType.IsControlled]: { descriptionRequired: true },
  [RelationType.ValueExchange]: { amount: true, descriptionRequired: true },
  [RelationType.Family]: { familialLinkType: true },
  [RelationType.Friendship]: { descriptionRequired: true },
  [RelationType.Love]: {},
  [RelationType.Opposition]: { descriptionRequired: true },
  [RelationType.Influences]: { descriptionRequired: true },
  [RelationType.Attendance]: {},
  [RelationType.GroupMember]: {},
  [RelationType.Other]: { descriptionRequired: true }
};

export const RelationTypeOptions: RelationTypeOption[] = RelationTypeValues.map(
  value => ({
    value: value,
    label: RELATION_TYPES_STR[value]
  })
);

export const FamilialLinkOptions: FamilialLinkOption[] = FamilialLinkValues.map(
  value => ({
    value: value,
    label: FAMILIAL_LINK_STR[value]
  })
);

export const EntityTypeOptions: EntityTypeOption[] = EntityTypeValues.map(
  value => ({
    value: value,
    label: ENTITY_TYPES[value]
  })
);

const AMOUNT_UNKNOWN = -1;
const AMOUNT_DO_ENTER = -2;

export const AmountOptions: AmountSelectOption[] = [
  { label: "Unknown amount", value: AMOUNT_UNKNOWN },
  { label: "0 US$", value: 0 },
  { label: "1+ US$", value: 1 },
  { label: "1'000+ US$", value: 1000 },
  { label: "10'000+ US$", value: 10000 },
  { label: "100'000+ US$", value: 100000 },
  { label: "1'000'000+ US$", value: 1000000 },
  { label: "10'000'000+ US$", value: 10000000 },
  { label: "100'000'000+ US$", value: 100000000 },
  { label: "1'000'000'000+ US$", value: 1000000000 },
  { label: "10'000'000'000+ US$", value: 10000000000 },
  // { label: "1 - 1'000 US$", value: 1 },
  // { label: "1'000 - 10'000 US$", value: 1000 },
  // { label: "10'000 - 100'000 US$", value: 10000 },
  // { label: "100'000 - 1'000'000 US$", value: 100000 },
  // { label: "1'000'000 - 10'000'000 US$", value: 1000000 },
  // { label: "10'000'000 - 100'000'000 US$", value: 10000000 },
  // { label: "100'000'000 - 1'000'000'000 US$", value: 100000000 },
  // { label: "1'000'000'000 - 10'000'000'000 US$", value: 1000000000 },
  // { label: "10'000'000'000+ US$", value: 10000000000 },
  { label: "Enter the exact amount", value: AMOUNT_DO_ENTER }
];
export const unkownAmountOption = AmountOptions[0];

export const ERROR_CODES = {
  MISSING_SOURCE_FORM: "MISSING_SOURCE_FORM",
  MISSING_SOURCE_LINK: "MISSING_SOURCE_LINK"
};

const CONSTS = {
  relCollectionName: "relations",
  entCollectionName: "entities",
  EMPTY_KEY: "_",
  AMOUNT_UNKNOWN,
  AMOUNT_DO_ENTER,
  ERROR_CODES
};

export default CONSTS;
