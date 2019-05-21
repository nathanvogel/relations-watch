import {
  EntityType,
  RelationType as RT,
  FamilialLink as FL,
  Dictionary
} from "../utils/types";

export const preferredLangs = [
  "en",
  "en-GB",
  "en-CA",
  "de-ch",
  "fr",
  "de",
  "de-formal",
  "de-at",
  "es"
];

export const entityTypeMap: { [key: number]: Array<string> } = {
  [EntityType.Human]: ["Q5"],
  [EntityType.State]: [
    "Q6256",
    "Q3624078",
    "Q7275",
    "Q1763527",
    "Q107390",
    "Q1048835",
    "Q15642541",
    "Q43702",
    "Q5255892",
    "Q183039",
    "Q1307214",
    "Q1520223",
    "Q7270"
  ],
  [EntityType.MoralPerson]: ["Q4830453", "Q783794", "Q6881511", "Q163740"],
  [EntityType.Group]: ["Q7278", "Q43229", "Q16334295", "Q16334298"],
  [EntityType.Media]: ["Q1110794", "Q11032", "Q1002697", "Q11033"],
  [EntityType.Event]: [
    "Q1190554",
    "Q26907166",
    "Q58415929",
    "Q1656682",
    "Q18669875"
  ]
};

type PropertyMapping = {
  invert?: boolean;
  type: RT;
  fType?: FL;
  text?: string;
};

const invert = true;

export const propertiesMap: Dictionary<PropertyMapping> = {
  P22: { type: RT.Family, fType: FL.childOf, invert }, // Father
  P25: { type: RT.Family, fType: FL.childOf, invert }, // Mother
  P40: { type: RT.Family, fType: FL.childOf }, // Child
  P26: { type: RT.Family, fType: FL.spouseOf }, // Spouse
  P3373: { type: RT.Family, fType: FL.siblingOf }, // Sibling
  P1038: { type: RT.Family, fType: FL.other }, // Relative
  P112: { type: RT.IsControlled, text: "$from was founded by $to." }, // founded by
  P463: { type: RT.GroupMember, text: "$from is a member of $to." } // member of
};
