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

export const entriesToIgnore: Array<string> = ["Q327591"];
export const typesToIgnore: Array<string> = [
  "Q188823", // scholarship
  "Q751876", // château
  "Q108696", // horse stud farm
  "Q1365179", // hôtel particulier
  "Q331225", // Fabarger egg
  "Q376", // clock
  "Q15727816", // painting series
  "Q3305213", // painting
  "Q46337", // manifesto
  "Q16970", // church building
  "Q144", // dog
  "Q1806324", // working dog
  "Q2850068", // us presidential family pet
  "Q1076486", // sport venue
  "Q811430", // construction
  "Q811979", // architectural structure
  "Q11303", // skyscraper
  "Q41176", // building
  "Q22811662", // image database
  "Q19844914", // university building
  "Q55488", // railway station
  "Q15238777", // legislative term
  "Q1254933" // astronomical observatory
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
  [EntityType.MoralPerson]: [
    "Q4830453",
    "Q783794",
    "Q6881511",
    "Q163740",
    "Q414147",
    "Q162633",
    "Q4671277",
    "Q2385804",
    "Q178706",
    "Q38723",
    "Q955824",
    "Q31855",
    "Q1664720",
    "Q1664720",
    "Q43229", // organisation
    "Q1328899",
    "Q11513034",
    "Q3551775",
    "Q3918",
    "Q3591586",
    "Q15343039",
    "Q3376045",
    "Q16463",
    "Q159334",
    "Q3914",
    "Q875538",
    "Q1542938",
    "Q847027",
    "Q902104",
    "Q15936437",
    "Q1188663",
    "Q23002054",
    "Q3457065",
    "Q194166",
    "Q1110684", // professional body
    "Q62078547", // public research university
    "Q748720", // institution of the European Union
    "Q613142", // law firm
    "Q9078534", // honor society
    "Q1320047", // book publisher
    "Q2085381", // publisher
    "Q7075" // library
  ],
  [EntityType.Group]: [
    "Q7278",
    "Q16334295",
    "Q16334298",
    "Q18811583",
    "Q1685451",
    "Q48204",
    "Q79913",
    "Q4358176",
    "Q1393724",
    "Q2716508",
    "Q7210356",
    "Q13417114",
    "Q8436",
    "Q874405",
    "Q1779527", // student fraternity
    "Q2738074", // political movement
    "Q49773", // social movement
    "Q177634", // community
    "Q848197", // parliamentary group
    "Q25796237", // political group of the European Parliament
    "Q233591", // communist party
    "Q1394441", // steering committee
    "Q2943071", // congressional caucus
    "Q751892", // caucus
    "Q623109", // sports league
    "Q721790", // extended family
    "Q2992826" // athletic conference
  ],
  [EntityType.Media]: [
    "Q1110794",
    "Q11032",
    "Q1002697",
    "Q11033", // mass media
    "Q15265344", // broadcaster
    "Q41298", // magazine
    "Q5398426", // television series
    "Q15416", // television program
    "Q14350" // radio station
  ],
  [EntityType.Event]: [
    "Q1190554",
    "Q26907166",
    "Q58415929",
    "Q1656682",
    "Q18669875",
    "Q184937",
    "Q625994",
    "Q2761147",
    "Q5389",
    "Q18608583",
    "Q13406554",
    "Q15275719",
    "Q1072326", // summit
    "Q28456918", // foreign electoral intervention
    "Q1168287", // intervention
    "Q1227249", // international incident
    "Q667276", // art exhibition
    "Q159821", // Summer Olympic Games
    "Q82414", // Winter Olympic Games
    "Q5389" // Olympic Games
  ]
};

type PropertyMapping = {
  invert?: boolean;
  type: RT;
  fType?: FL;
  text?: string;
  owned?: number;
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
  P463: { type: RT.GroupMember }, // member of
  P53: { type: RT.GroupMember }, // family
  P102: { type: RT.GroupMember }, // member of political party
  P1344: { type: RT.Attendance }, // participant of
  P108: { type: RT.JobDependsOn }, // employer
  P1830: { type: RT.IsOwned, invert, owned: 100 }, // owner
  P737: { type: RT.IsInfluenced }, // influenced by
  P361: { type: RT.Other, text: "$from is part of $to." } // part of
};
