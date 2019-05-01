import { AnyAction } from "redux";

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
  type: number;
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
}

export interface Edge {
  _key?: string;
  _from: string;
  _to: string;
  text: string;
  type: number;
  amount?: number;
  exactAmount?: boolean;
  sources?: SourceLink[];
  sourceText?: string;
}

export interface EdgePreview {
  _key: string;
  _from: string;
  _to: string;
  type: number;
}

export type CommonEdge = Edge | EdgePreview;

export type ConnectedEntities = {
  edges: Array<EdgePreview>;
  entities: [string, number][];
};

export type LinkedEntities = {
  [key: string]: { [key: string]: number };
};

export type LinkRenderData = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  angle: number;
  entityKey: string;
  types: number[];
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
