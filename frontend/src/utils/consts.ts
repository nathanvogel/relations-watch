import {
  RelationType,
  RelationTypeOption,
  RelationTypeValues,
  FamilialLinkOption,
  FamilialLinkValues,
  RelationTypeRequirements,
  AmountSelectOption
} from "./types";
import { EntityType as E } from "./types";
import { RELATION_TYPES_STR, FAMILIAL_LINK_STR } from "../strings/strings";

// Should have been maintained in sync with the backend here ?
// /backend/service-graph-api/scripts/consts.js

// TODO: Use an Android-R like library to manage this stuff.
export const RELATION_COLORS = {
  [RelationType.IsOwned]: "#e7b300",
  [RelationType.JobDependsOn]: "#ee8012",
  [RelationType.IsControled]: "#a63e14",
  [RelationType.ValueExchange]: "#ffeb00",
  [RelationType.Family]: "#007500",
  [RelationType.Friendship]: "#00b8b8",
  [RelationType.Love]: "#de3d83",
  [RelationType.Opposition]: "#db2f27",
  [RelationType.Influences]: "#f45844",
  [RelationType.Attendance]: "#00b8b8",
  [RelationType.GroupMember]: "#0095a3",
  [RelationType.Other]: "#444444"
};

export const POSSIBLE_LINKS = {
  [RelationType.IsOwned]: [
    [E.MoralPerson, E.Event],
    [E.MoralPerson, E.Group, E.PhysicalPerson]
  ],
  [RelationType.JobDependsOn]: [
    [E.PhysicalPerson, E.MoralPerson],
    [E.MoralPerson, E.Group, E.PhysicalPerson]
  ],
  [RelationType.IsControled]: [
    [E.Group, E.MoralPerson],
    [E.PhysicalPerson, E.MoralPerson, E.Group]
  ],
  [RelationType.ValueExchange]: [
    [E.MoralPerson, E.Group, E.PhysicalPerson],
    [E.MoralPerson, E.Group, E.PhysicalPerson]
  ],
  [RelationType.Family]: [[E.PhysicalPerson], [E.PhysicalPerson]],
  [RelationType.Friendship]: [[E.PhysicalPerson], [E.PhysicalPerson]],
  [RelationType.Love]: [[E.PhysicalPerson], [E.PhysicalPerson]],
  [RelationType.Opposition]: [
    [E.MoralPerson, E.Group, E.PhysicalPerson],
    [E.MoralPerson, E.Group, E.PhysicalPerson]
  ],
  [RelationType.Influences]: [
    [E.MoralPerson, E.Group, E.PhysicalPerson],
    [E.MoralPerson, E.Group, E.PhysicalPerson]
  ],
  [RelationType.Attendance]: [
    [E.MoralPerson, E.Group, E.PhysicalPerson],
    [E.Event]
  ],
  [RelationType.GroupMember]: [[E.MoralPerson, E.PhysicalPerson], [E.Group]],
  [RelationType.Other]: [
    [E.MoralPerson, E.Group, E.PhysicalPerson, E.Event],
    [E.MoralPerson, E.Group, E.PhysicalPerson, E.Event]
  ]
};

type Requirements = {
  [key: number]: RelationTypeRequirements;
};
export const RELATION_REQUIREMENTS: Requirements = {
  [RelationType.IsOwned]: { ownedPercent: true },
  [RelationType.JobDependsOn]: { amount: true, descriptionRequired: true },
  [RelationType.IsControled]: { descriptionRequired: true },
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
  RELATION_COLORS,
  AMOUNT_UNKNOWN,
  AMOUNT_DO_ENTER,
  ERROR_CODES
};

export default CONSTS;
