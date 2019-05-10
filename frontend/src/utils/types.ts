import { AnyAction } from "redux";
import { SimulationNodeDatum } from "d3-force";

export enum EntityType {
  PhysicalPerson = 1,
  MoralPerson = 2,
  Event = 10,
  Group = 100
}
export const EntityTypeValues: EntityType[] = Object.values(EntityType).filter(
  x => typeof x === "number"
);

export type ErrorPayload = {
  eData: any;
  eMessage: string;
  eStatus: number | string;
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

export interface EntityPreview {
  _key: string;
  name: string;
  imageId?: string;
  type: EntityType;
}

export interface Edge {
  _key?: string;
  _from: string;
  _to: string;
  text: string;
  type: number;
  amount?: number;
  exactAmount?: boolean;
  sources: SourceLink[];
  sourceText?: string;
}

export interface EdgePreview {
  _key: string;
  _from: string;
  _to: string;
  type: number;
}

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
  types: number[];
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
  fullUrl?: string;
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

export type ReactTypeOption = {
  value: string;
  label: string;
  [key: string]: any;
};
