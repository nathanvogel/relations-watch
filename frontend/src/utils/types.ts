import { AnyAction } from "redux";
import { SimulationNodeDatum } from "d3-force";
import validator from "validator";
import { ClaimSnakEntityValue, ClaimSnakValue } from "wikidata-sdk";

export interface Dictionary<T> {
  [key: string]: T;
}

export enum EntityType {
  Human = 1,
  MoralPerson = 2,
  Event = 10,
  Group = 100,
  Media = 200,
  State = 300,
}
export const EntityTypeValues: EntityType[] = Object.values(EntityType).filter(
  x => typeof x === "number"
);
export type EntityTypeOption = {
  label: string;
  value: EntityType;
};

export enum RelationType {
  IsOwned = 1,
  JobDependsOn = 30,
  IsControlled = 50,
  ValueExchange = 100,
  IsInfluenced = 500,
  Attendance = 1000,
  GroupMember = 2000,
  Family = 300,
  Love = 320,
  Opposition = 330,
  Other = 3000,
  // Friendship = 310,
}
export const RelationTypeValues: RelationType[] = Object.values(
  RelationType
).filter(x => typeof x === "number");

export type RelationTypeOption = {
  label: string;
  value: RelationType;
};

export type ErrorPayload = {
  eData: any;
  eMessage: string;
  eStatus: number | string;
};

export type RelationTypeRequirements = {
  descriptionRequired?: boolean;
  amount?: boolean;
  familialLinkType?: boolean;
  ownedPercent?: boolean;
};

export enum FamilialLink {
  childOf = 1,
  siblingOf = 2,
  spouseOf = 3,
  // grandchildOf = 14,
  // cousinOf = 15,
  // niblingOf = 16,
  other = 100, // son-in-law, etc.
}
export const FamilialLinkValues: FamilialLink[] = Object.values(
  FamilialLink
).filter(x => typeof x === "number");

export type FamilialLinkOption = {
  label: string;
  value: FamilialLink;
};

export interface Action extends AnyAction {
  type: string;
  status: Status;
  meta: {
    entityKey?: string;
    requestId?: string;
    relationId?: string;
    sourceKeys?: string[];
    entityKeys?: string[];
    error?: ErrorPayload;
    edgeKey?: string;
    _key?: string;
    _from?: string;
    _to?: string;
  };
  payload?: any;
}

export enum Status {
  Requested,
  Ok,
  Clear,
  Error,
}

export enum DatasetId {
  MediasFrancais = "mfid",
  MediasFrancaisByName = "mfn",
  Wikidata = "wd",
}

export type Entity = {
  _key?: string;
  name: string;
  text?: string;
  type: EntityType;
  imageId?: string;
  linkWikipedia?: string;
  linkCrunchbase?: string;
  linkTwitter?: string;
  linkFacebook?: string;
  linkYoutube?: string;
  linkWebsite?: string;
  ds?: { [key in DatasetId]?: string };
};

export type EntityPreview = {
  _key: string;
  name: string;
  imageId?: string;
  type: EntityType;
};

export type Edge = {
  _key?: string;
  _from: string;
  _to: string;
  text: string;
  type: RelationType;
  amount?: number;
  exactAmount?: boolean;
  fType?: FamilialLink;
  owned?: number;
  sources: SourceLink[];
  sourceText?: string;
  ds?: { [key in DatasetId]?: string };
};

export type EdgePreview = {
  _key: string;
  _from: string;
  _to: string;
  type: RelationType;
  fType?: FamilialLink;
};

export type CommonEdge = Edge | EdgePreview;

export type ConnectedEntity = {
  entityKey: string;
  edgeCount: number;
};

export type Connections = {
  edges: Array<EdgePreview>;
  entities: [string, number][];
  toEntity: { [entityKey: string]: number };
};

export type ConnectionsList = {
  [key: string]: Connections;
};

export interface LinkedEntities {
  [key: string]: { [key: string]: number };
}

export type RelationRenderData = {
  bx1: number;
  by1: number;
  bx2: number;
  by2: number;
  from: string;
  to: string;
  source: string | SimulationNodeDatum;
  target: string | SimulationNodeDatum;
  relationId: string;
  types: RelationType[];
  withType: NodeRenderType;
  visited: boolean;
};

export enum NodeRenderType {
  Primary,
  Secondary,
  Tertiary,
}

export type NodeRenderData = {
  bx: number;
  by: number;
  type: NodeRenderType;
  visited: boolean;
  entityKey: string;
  entity: EntityPreview;
  // From d3-force:
  // Each node must be an object. The following properties are assigned by the simulation:
  index?: number; // the node’s zero-based index into nodes
  x?: number; // the node’s current x-position
  y?: number; // the node’s current y-position
  vx?: number; // the node’s current x-velocity
  vy?: number; // the node’s current y-velocity
  fx?: number; // the node’s fixed position
  fy?: number; // the node’s fixe position
  // Text sizing
  bb?: DOMRect;
};

// Zones
export enum RelZone {
  Default,
  Main,
  IsControlled,
  DoesControl,
  IsDescendant,
  IsRelated,
  IsChild,
  Ideology,
  WorksFor,
  GivesWork,
  Other,
  Opposition,
  Participates,
}
export const RelZoneValues: RelZone[] = Object.values(RelZone).filter(
  x => typeof x === "number"
);

export const TypeWeights: {
  [rType: number]: {
    nor: [RelZone, number];
    inv: [RelZone, number];
  };
} = {
  [RelationType.JobDependsOn]: {
    nor: [RelZone.WorksFor, 1],
    inv: [RelZone.GivesWork, 1],
  },
  [RelationType.IsOwned]: {
    nor: [RelZone.IsControlled, 3],
    inv: [RelZone.DoesControl, 3],
  },
  [RelationType.IsControlled]: {
    nor: [RelZone.IsControlled, 1.5],
    inv: [RelZone.DoesControl, 1.5],
  },
  [RelationType.ValueExchange]: {
    nor: [RelZone.Other, 1],
    inv: [RelZone.Other, 1],
  },
  [RelationType.Love]: {
    nor: [RelZone.IsRelated, 1],
    inv: [RelZone.IsRelated, 1],
  },
  [RelationType.Opposition]: {
    nor: [RelZone.Opposition, 1],
    inv: [RelZone.Opposition, 1],
  },
  [RelationType.IsInfluenced]: {
    nor: [RelZone.Ideology, 1],
    inv: [RelZone.Other, 1],
  },
  [RelationType.Attendance]: {
    nor: [RelZone.Participates, 1],
    inv: [RelZone.Other, 1],
  },
  [RelationType.GroupMember]: {
    nor: [RelZone.Participates, 1],
    inv: [RelZone.Other, 1],
  },
  [RelationType.Other]: {
    nor: [RelZone.Other, 1],
    inv: [RelZone.Other, 1],
  },
};

export const ProximityWeights = {
  [RelationType.JobDependsOn]: 1,
  [RelationType.IsOwned]: 4,
  [RelationType.IsControlled]: 2,
  [RelationType.ValueExchange]: 1,
  [RelationType.Love]: 3,
  [RelationType.Opposition]: -2,
  [RelationType.IsInfluenced]: 1,
  [RelationType.Attendance]: 1,
  [RelationType.GroupMember]: 1.5,
  [RelationType.Other]: 0.5,
};

export const FProximityWeights = {
  [FamilialLink.childOf]: 1,
  [FamilialLink.siblingOf]: 1,
  [FamilialLink.spouseOf]: 3,
  [FamilialLink.other]: 0.3,
};

export const DefaultZones = {
  [RelZone.Default]: 0,
  [RelZone.Main]: 0,
  [RelZone.IsControlled]: 0,
  [RelZone.DoesControl]: 0,
  [RelZone.IsDescendant]: 0,
  [RelZone.IsRelated]: 0,
  [RelZone.IsChild]: 0,
  [RelZone.Ideology]: 0,
  [RelZone.WorksFor]: 0,
  [RelZone.GivesWork]: 0,
  [RelZone.Other]: 0,
  [RelZone.Opposition]: 0,
  [RelZone.Participates]: 0,
};

export type Clusters = {
  [RelZone.Default]: null | V4NodeDatum;
  [RelZone.Main]: null | V4NodeDatum;
  [RelZone.IsControlled]: null | V4NodeDatum;
  [RelZone.DoesControl]: null | V4NodeDatum;
  [RelZone.IsDescendant]: null | V4NodeDatum;
  [RelZone.IsRelated]: null | V4NodeDatum;
  [RelZone.IsChild]: null | V4NodeDatum;
  [RelZone.Ideology]: null | V4NodeDatum;
  [RelZone.WorksFor]: null | V4NodeDatum;
  [RelZone.GivesWork]: null | V4NodeDatum;
  [RelZone.Other]: null | V4NodeDatum;
  [RelZone.Opposition]: null | V4NodeDatum;
  [RelZone.Participates]: null | V4NodeDatum;
};

export type RelZones = typeof DefaultZones;

export enum LinkDir {
  None,
  Normal,
  Invert,
  Both,
}

export const DefaultTypeDirs = {
  [RelationType.IsOwned]: LinkDir.None,
  [RelationType.JobDependsOn]: LinkDir.None,
  [RelationType.IsControlled]: LinkDir.None,
  [RelationType.ValueExchange]: LinkDir.None,
  [RelationType.Family]: LinkDir.None,
  [RelationType.Love]: LinkDir.None,
  [RelationType.Opposition]: LinkDir.None,
  [RelationType.IsInfluenced]: LinkDir.None,
  [RelationType.Attendance]: LinkDir.None,
  [RelationType.GroupMember]: LinkDir.None,
  [RelationType.Other]: LinkDir.None,
};

export const DefaultTypeWeights = {
  [RelationType.IsOwned]: 0,
  [RelationType.JobDependsOn]: 0,
  [RelationType.IsControlled]: 0,
  [RelationType.ValueExchange]: 0,
  [RelationType.Family]: 0,
  [RelationType.Love]: 0,
  [RelationType.Opposition]: 0,
  [RelationType.IsInfluenced]: 0,
  [RelationType.Attendance]: 0,
  [RelationType.GroupMember]: 0,
  [RelationType.Other]: 0,
};

export type V4GenericLinkDatum<T> = {
  // Data
  sourceKey: string;
  targetKey: string;
  source: string | T;
  target: string | T;
  relationId: string;
  /**
   * Whether the user has visited both connected entities or the relation page.
   */
  visited: boolean;
  /**
   * The "most primary" node type this edges connects to.
   * This is to know whether it's a 1st/2nd/3d/etc. degree edge
   */
  withType: NodeRenderType;
  /**
   * A proximity score computed from all the edges between those entities.
   */
  proximity: number;
  /**
   * For each RelationType, indicate whether this type of relation
   * has a direction or not, and which direction(s).
   */
  tDirections: { [key: number]: LinkDir };
  /**
   * For each RelationType, a score of the importance of this edge is computed.
   */
  tWeights: { [key: number]: number };
  /**
   * Rank non-null RelationType scores, from highest to lowest.
   */
  sortedTypes: RelationType[];
};

export type V4IndicatorDatum = {
  // Data
  fromKey: string;
  toKey: string;
  relationId: string;
  indicatorId: string;
  /**
   * The "most primary" node type this edges connects to.
   * This is to know whether it's a 1st/2nd/3d/etc. degree edge
   */
  withType: NodeRenderType;
  /**
   * Type of the presented edge
   */
  type: RelationType;
  /**
   * Direction of the dot
   */
  direction: LinkDir.Normal | LinkDir.Invert;
  /**
   * In case the indicator must make room for other previous indicators
   */
  offsetIndex: number;
};

// Must be iteratively calculable
export type V4NodeDatum = {
  entityKey: string;
  entity: EntityPreview;
  /**
   * The x position, except for initialization, this is controlled by
   * the d3-force simulation
   */
  x: number;
  /**
   * The y position, except for initialization, this is controlled by
   * the d3-force simulation
   */
  y: number;
  /**
   * Used by some d3-force plugin I think.
   */
  radius: number;
  /**
   * Whether the user has visited the entity or one of its relation pages.
   */
  visited: boolean;
  /**
   * Whether this is the primary, secondary or tertiary focus of the graph.
   */
  type: NodeRenderType;
  /**
   * Score each zone on how much it corresponds to the relation.
   */
  zones: RelZones; // indexed on RelZone
  /**
   * Sorted 'zones' with only truthy number scores
   * Must always contain at least one element.
   */
  sortedZones: RelZone[]; // indexed on RelZone
  /**
   * Total of the different 'zones' scores, for normalization.
   */
  zoneTotal: number;
  /**
   * Property from d3-force, assigned by the simulation
   */
  index?: number; // the node’s zero-based index into nodes
  /**
   * Holder for the post-render computed text box size
   */
  bb?: DOMRect;
};

export type V4LinkPosDatum = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  angle: number;
};

export type V4LinkDatum = V4GenericLinkDatum<V4NodeDatum>;

export type Source = {
  _key?: string;
  ref: string;
  type: number;
  authors: string[];
  description: string;
  pAuthor?: string;
  pTitle?: string;
  pDescription?: string;
  rootDomain?: string;
  domain?: string;
  // Only the first one linked, but it should be unused except for legacy support
  fullUrl?: string;
};

export enum SourceType {
  Link = 1,
  TextRef = 2,
}

export function getRefType(fullRef: string) {
  const isURL = validator.isURL(fullRef, {
    protocols: ["http", "https", "ftp"],
    require_tld: true,
    require_protocol: true,
    require_host: true,
    require_valid_protocol: true,
    allow_underscores: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    disallow_auth: false,
  });
  return isURL ? SourceType.Link : SourceType.TextRef;
}

export type SourceLink = {
  fullUrl: string; // Should be in SourceLink
  type: SourceLinkType;
  comments: Comment[];
  sourceKey?: string;
};

export type Comment = {
  posted?: number;
  t: string;
};

export enum SourceLinkType {
  Neutral,
  Confirms,
  Refutes,
}

export type ReactSelectOption = {
  value: string;
  label: string;
  [key: string]: any;
};

export type EntitySelectOption = {
  value: string;
  label: string;
  text?: string;
  type?: EntityType;
  dataset?: DatasetId;
};

export type AmountSelectOption = {
  value: number;
  label: string;
};

export type SourceSuggestion = {
  _key: string;
  ref: string;
  pTitle?: string;
  fullUrl?: string;
};

export type SourceSelectOption = {
  value: string;
  label: string;
  ref: string;
  pTitle?: string;
  fullUrl?: string;
};

/**
 * Useful to generate key lists from JSON files
 * in order to get static (dynamic) Typescript autocomplete.
 */
export type KeyList<T> = { readonly [P in keyof T]: P };

export function isEdge(element: Edge | Entity): element is Edge {
  return (<Edge>element)._from !== undefined;
}
export function isEntity(element: Edge | Entity): element is Entity {
  return (<Edge>element)._from === undefined;
}

/**
 * Possible states of the SourceSelector component.
 */
export enum SourceSelectorMode {
  SourceSelected,
  EditingRef,
  EditingNewSource,
}

/**
 * Manually checks if a datavalue returned by Wikidata corresponds to a
 * wd.Entity ID.
 * @param  datavalue The datavalue to check
 * @return           true if the datavalue corresponds to an wd.Entity ID.
 */
export function isClaimSnakEntityValue(
  datavalue: unknown
): datavalue is ClaimSnakEntityValue {
  return isClaimSnakValue(datavalue) && datavalue.type === "wikibase-entityid";
}

export function isClaimSnakValue(
  datavalue: unknown
): datavalue is ClaimSnakValue {
  return (
    datavalue &&
    typeof datavalue === "object" &&
    typeof (datavalue as any).type === "string"
  );
}

export enum ImportStage {
  Clear,
  FetchingDataset,
  FetchedDataset,
  FetchingSimilarEntities,
  FetchedSimilarEntities,
  // Here we're waiting for the user to select which entities are similar
  PostingSimilarEntities,
  PostedSimilarEntities,
  FetchingEntityDiff,
  FetchedEntityDiff,
  FetchingEdgeDiff,
  FetchedEdgeDiff,
  WaitingForDiffConfirmation,
  // Here we're waiting for the user to select which elements should be uploaded.
  PostingEntityDiff,
  PostedEntityDiff,
  PostingEdgeDiff,
  PostedEdgeDiff,
  ImportSuccessful,
}

export type SimilarEntities = { [entryDatasetId: string]: Entity[] };
export type SimilarEntitiesSelection = { [entryDatasetId: string]: number };

export type DatasetDiffResponseData<T> = {
  existingElements: T[];
  elementsToPatch: T[];
  elementsToPost: T[];
};

export type Modifier = (v: any) => any;
