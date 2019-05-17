// Manually copied and maintained from /frontend/src/utils for now...

export enum EntityType {
  Human = 1,
  MoralPerson = 2,
  Event = 10,
  Group = 100,
  Media = 200,
  State = 300
}

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

export enum FamilialLink {
  childOf = 1,
  siblingOf = 2,
  spouseOf = 3,
  grandchildOf = 14,
  cousinOf = 15,
  niblingOf = 16,
  other = 100 // son-in-law, etc.
}

export type DatasetId = "mfn" | "mfid";

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
  ds?: { [key in DatasetId]: string };
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
  ds?: { [key in DatasetId]: string };
};

export type EdgePreview = {
  _key: string;
  _from: string;
  _to: string;
  type: RelationType;
};

export type CommonEdge = Edge | EdgePreview;

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
  TextRef = 2
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
  Refutes
}

export function isEdge(element: Edge | Entity): element is Edge {
  return (<Edge>element)._from !== undefined;
}
export function isEntity(element: Edge | Entity): element is Entity {
  return (<Edge>element)._from === undefined;
}
