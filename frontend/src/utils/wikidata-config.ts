import {
  EntityType,
  RelationType as RT,
  FamilialLink as FL,
  Dictionary,
  Modifier,
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
  "es",
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
  "Q7315155", // research center
  "Q19844914", // university building
  "Q55488", // railway station
  "Q15238777", // legislative term
  "Q117850", // doctrine
  "Q1254933", // astronomical observatory
  "GAFAM", // film
  "Q431289", // brand
  "Q1886349", // logo
  "Q837816", // wordmark
  "Q914359", // cloud storage
  "Q4839801", // backup software
  "Q7397", // software
  "Q570871", // email client
];

export const entityTypeMap: { [key: number]: Array<string> } = {
  [EntityType.Human]: [
    "Q5",
    "Q190", // god
    "Q20643955", // human biblical figure
    "Q15632617", // fictional human
    "Q95074", // fictionnal character
    "Q215627", // person
    "Q795052", // individual
    "Q20086263", // game of thrones character
    "Q15773317", // television character
    "Q19324463", // fictional child
    "Q20086260", // A Song of Ice and Fire character
    "Q4271324", // mythical character
    "Q21070598", // character that may be fictional
  ],
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
    "Q7270",
    "Q35657", // state of the United States
    "Q15063611", // city (N.Y)
    "Q484170", // commune de France
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
    "Q7075", // library
    "Q936518", // aeorspace manufacturer
    "Q1194970", // dot-com company
    "Q6944143", // mutual-benefit nonprofit corporation
    "Q155271", // think-thank
    "Q210167", // video-game developer
    "Q658255", // subsidiary company
    "Q17149090", // armed organization
    "Q17127659", // terrorist organization
    "Q1058914", // software company
    "Q1934969", // defense contractor
    "Q1589009", // privately held company
    "Q1666019", // pressure group
    "Q484652", // international organization
    "Q1127126", // military alliance
    "Q245065", // intergovernemental organization
    "Q15925165", // specialized agency of the United Nations
    "Q18011131", // Fictional military unit
    "Q176799", // military unit
    "Q14623646", // fictional organization
    "Q1061648", // sovereign wealth fund
    "Q4201895", // investment fund
    "Q15711797", // finance ministry
    "Q192350", // ministry
    "Q327333", // government agency
    "Q13442814", // news agency
    "Q192283", // news agency
    "Q1331793", // media company
    "Q27970162", // hardware store chain
    "Q507619", // retail chain
    "Q2872764", // French independent administrative authority
    "Q157031", // foundation
    "Q3238445", // security agency
    "Q47913", // intelligence agency
    "Q14037025", // ministry of France
    "Q6589202", // interior ministry
    "Q204310", // gendarmery
    "Q392918", // agency of the ue
    "Q896375", // federal ministry in germany
    "Q637846", // upper house
    "Q781132", // military branch
    "Q4508", // navy
    "Q939616", // secret service
    "Q772547", // armed forces
    "Q1378781", // obédience maçonnique
    "Q219577", // holding company
    "Q9209474", // auction house
    "Q46970", // airline
    "Q1875615", // air carrier
    "Q18558685", // autorité publique indépendante
    "Q730038", // credit institution
    "Q161726", // multinational
    "Q23670565", // professional services firm
    "Q20031260", // IT consulting company
    "Q15850083", // university of applied science
    "Q1252971", // food manufacturer
    "Q891723", // public company
    "Q29643579", // multi-level marketing company
    "Q197952", // corporate group
    "Q1262438", // international court
    "Q41487", // court
    "Q1412224", // tribunal
    "Q15708736", // public authority
    "Q1125239", // public body
    "Q2659904", // governement organization
    "Q895526", // organ (entity that acts in a legal sense)
    "Q1785733", // environmental organization
    "Q4120211", // regional organization
    "Q1335818", // supranational organisation
    "Q270791", // state-owned entreprise
    "Q4335775", // bande organisée
    "Q1788992", // organisation criminelle
    "Q275186", // bande criminelle
    "Q17377208", // Railway Undertaking
    "Q249556", // entreprise ferroviaire
    "Q740752", // entreprise de transport
    "Q2995256", // constructeur ferroviaire
    "Q166280", // société anonyme
    "Q19973770", // Ministry of culture
    "Q4481741", // federal ministry (Russian federation)
    "Q2824642", // administration publique française
    "Q18087867", // direction minitérielle (type d'administration française)
    "Q2088231", // military reserve
    "Q1807108", // shipping line
    "Q1144170", // ministère publique en France
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
    "Q190652", // central committee
    "Q1394441", // steering committee
    "Q2943071", // congressional caucus
    "Q751892", // caucus
    "Q623109", // sports league
    "Q721790", // extended family
    "Q19791817", // fictional noble family
    "Q2992826", // athletic conference
    "Q16887380", // group
    "Q18811582", // fraternity
    "Q8059357", // youth league
    "Q21685563", // facebook group
    "Q6576792", // online community
    "Q210980", // virtual community
    "Q24649", // european political party
    "Q766570", // political party in russia
    "Q4370110", // political party in the russian empire
    "Q388602", // electoral alliance
    "Q996839", // fraternité
    "Q17326725", // business group: set of legally independent companies that belong together
    "Q3623811", // economic union
    "Q22679796", // correspondents' association, press association
    "Q188628", // board of directors (conseil d'administration)
    "Q938236", // comittee
    "Q5588651", // governing body
    "Q988108", // club
  ],
  [EntityType.Media]: [
    "Q1110794",
    "Q11032", // newspaper
    "Q1002697",
    "Q11033", // mass media
    "Q15265344", // broadcaster
    "Q41298", // magazine
    "Q5398426", // television series
    "Q15416", // television program
    "Q1555508", // radio program
    "Q1616075", // television station
    "Q14350", // radio station
    "Q7094076", // online database
    "Q593744", // knowledge base
    "Q1153191", // online newspaper
    "Q17232649", // news website
    "Q5276122", // digital newspaper
    "Q1358344", // newscast
    "Q24634210", // podcast
    "Q11578774", // broadcasting program
    "Q35127", // website
    "Q752106", // legislature broadcaster
    "Q561068", // specialty channel
    "Q2001305", // television channel
    "Q267628", // rubrique
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
    "Q22704077", // biblical episode
    "Q667276", // art exhibition
    "Q159821", // Summer Olympic Games
    "Q82414", // Winter Olympic Games
    "Q5389", // Olympic Games
    "Q15707521", // fictional battle
    "Q198", // war
    "Q180684", // conflict
    "Q41397", // genocide
    "Q934744", // political scandal
    "Q2334719", // legal case
    "Q60589804", // presidential campaign
    "Q11642595", // election campaign
    "Q847301", // political campaign
    "Q11514315", // historical period
    "Q10931", // revolution
    "Q192909", // scandal
    "Q2826027", // politic-finance scandal
  ],
};

type PropertyMapping = {
  invert?: boolean;
  type: RT;
  fType?: FL;
  text?: string;
  owned?: number;
  destInQualifiers?: Array<string>;
  ownedInQualifiers?: Array<string>;
  ownedModifier?: Dictionary<Modifier>;
};

const invert = true;

export const propertiesMap: Dictionary<PropertyMapping> = {
  P22: { type: RT.Family, fType: FL.childOf }, // Father
  P25: { type: RT.Family, fType: FL.childOf }, // Mother
  P40: { type: RT.Family, fType: FL.childOf, invert }, // Child
  P26: { type: RT.Family, fType: FL.spouseOf }, // Spouse
  P3373: { type: RT.Family, fType: FL.siblingOf }, // Sibling
  P1038: { type: RT.Family, fType: FL.other }, // Relative
  P451: { type: RT.Love }, // partner
  P112: { type: RT.IsControlled, text: "$from was founded by $to." }, // founded by
  P169: {
    type: RT.IsControlled,
    text: "$to is chief executive officer of $from.",
  }, // chief executive officer
  P35: {
    type: RT.IsControlled,
    text: "$to is the head of the state $from.",
  }, // head of state
  P6: {
    type: RT.IsControlled,
    text: "$to is the head of the governement $from.",
  }, // head of state
  P488: { type: RT.IsControlled, text: "$to is chairman of $from." }, // chairman
  P3320: { type: RT.IsControlled, text: "$to is a board member of $from." }, // board member
  P5769: { type: RT.IsControlled, text: "$to is editor-in-chief of $from." }, // editor-in-chief
  P5052: {
    type: RT.IsControlled,
    text: "$to is supervisory board member of $from.",
  }, // supervisory oard member
  P1037: { type: RT.IsControlled, text: "$to is director/manager of $from." }, // chairman
  P170: { type: RT.IsControlled, text: "$from was created by $to." }, // creator
  P598: { type: RT.IsControlled, text: "$from is commander of $to.", invert }, // commander of
  P241: {
    type: RT.JobDependsOn,
    text: "$from is in the military branch of $to.",
  }, // military branch
  P463: { type: RT.GroupMember }, // member of
  P53: { type: RT.GroupMember }, // family
  P102: { type: RT.GroupMember }, // member of political party
  P1344: { type: RT.Attendance }, // participant of
  P108: { type: RT.JobDependsOn }, // employer
  P1830: {
    type: RT.IsOwned,
    invert,
    owned: 100,
    ownedInQualifiers: ["P1107"],
    ownedModifier: { P1107: proportionToOwned },
  }, // owner of
  P199: {
    type: RT.IsOwned,
    invert,
    owned: 100,
    text: "$from is a business division of $to.",
  }, // business division
  P355: {
    type: RT.IsOwned,
    invert,
    owned: 100,
    text: "$from is a subsidiary of $to.",
  }, // subsidiary
  P749: {
    type: RT.IsOwned,
    owned: 100,
    text: "$to is the parent organization of $from.",
  }, // parent organization
  P737: { type: RT.IsInfluenced }, // influenced by
  P361: { type: RT.Other, text: "$from is part of $to." }, // part of
  P156: { type: RT.Other, text: "$to replaced $from." }, // part of
  P39: {
    type: RT.JobDependsOn,
    text: "$from works for $to.",
    destInQualifiers: ["P108", "P642"],
  }, // position held
  P127: {
    type: RT.IsOwned,
    owned: 100,
    ownedInQualifiers: ["P1107"],
    ownedModifier: { P1107: proportionToOwned },
  }, // owned by
  P150: {
    type: RT.GroupMember,
    invert: true,
  }, // contains administrative territorial entity
  // P527 ? = has part
};

function proportionToOwned(value: any) {
  return typeof value === "number" ? Math.round(value * 1000) / 10 : 100;
}
