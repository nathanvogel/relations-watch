import { AnyAction } from "redux";
import { SimulationNodeDatum } from "d3-force";

export enum EntityType {
  Human = 1,
  MoralPerson = 2,
  Event = 10,
  Group = 100,
  Media = 200,
  State = 300
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
  Family = 300,
  Friendship = 310,
  Love = 320,
  Opposition = 330,
  Influences = 500,
  Attendance = 1000,
  GroupMember = 2000,
  Other = 3000
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
  grandchildOf = 14,
  cousinOf = 15,
  niblingOf = 16,
  other = 100 // son-in-law, etc.
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
  Error
}

export type Entity = {
  _key?: string;
  name: string;
  type: EntityType;
  imageId?: string;
  linkWikipedia?: string;
  linkCrunchbase?: string;
  linkTwitter?: string;
  linkFacebook?: string;
  linkYoutube?: string;
  linkWebsite?: string;
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
};

export type EdgePreview = {
  _key: string;
  _from: string;
  _to: string;
  type: RelationType;
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
  Tertiary
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

export type Source = {
  _key?: string;
  ref: string;
  type: number;
  authors: string[];
  fullUrl?: string; // Should be in SourceLink
  description: string;
  pAuthor?: string;
  pTitle?: string;
  pDescription?: string;
  rootDomain?: string;
  domain?: string;
};

export enum SourceType {
  Link = 1,
  TextRef = 2
}

export type SourceLink = {
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
  Refutes
}

export type ReactSelectOption = {
  value: string;
  label: string;
  [key: string]: any;
};

export type AmountSelectOption = {
  value: number;
  label: string;
};

/**
 * Useful to generate key lists from JSON files
 * in order to get static (dynamic) Typescript autocomplete.
 */
export type KeyList<T> = { readonly [P in keyof T]: P };
