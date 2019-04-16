export type ErrorPayload = {
  eData: any;
  eMessage: string;
  eStatus: number | string;
};

export type Action = {
  type: string;
  status: Status;
  meta: {
    entityKey?: string;
    requestId?: string;
    relationId?: string;
    error?: ErrorPayload;
  };
  payload?: any;
};

export enum Status {
  Requested,
  Ok,
  Clear,
  Error
}

export type Entity = {
  _key: string;
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

export interface EntityForUpload {
  name: string;
  type: number;
  imageId?: string;
  linkWikipedia?: string;
  linkCrunchbase?: string;
  linkTwitter?: string;
  linkFacebook?: string;
  linkYoutube?: string;
  linkWebsite?: string;
}

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
  sources: Array<object>;
  sourceText?: string;
}

export interface EdgePreview {
  _key: string;
  _from: string;
  _to: string;
  type: number;
}

export type CommonEdge = Edge | EdgePreview;

export interface Relation {
  [key: string]: Edge;
}

export type ConnectedEntities = {
  edges: Array<EdgePreview>;
  entities: [string, number][];
};

export type LinkedEntities = {
  [key: string]: { [key: string]: number };
};
