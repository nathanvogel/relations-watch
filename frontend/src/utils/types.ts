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
  payload?: object;
};

export enum Status {
  Requested,
  Ok,
  Clear,
  Error
}

export interface Entity {
  name: string;
  type: number;
  imageId?: string;
}

export interface Edge {
  _from: string;
  _to: string;
  text: string;
  type: number;
  amount?: number;
  exactAmount?: boolean;
  sources: Array<object>;
}

export interface Relation {
  [key: string]: Edge;
}
