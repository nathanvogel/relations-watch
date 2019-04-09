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
    error?: ErrorPayload;
  };
  payload?: object;
};

export enum Status {
  Requested,
  Ok,
  Error
}

export interface Entity {
  name: string;
}

export interface Edge {
  name: string;
  _from: string;
  _to: string;
  text: string;
  type: number;
  amount?: number;
  exactAmount?: boolean;
  job?: boolean;
}

export interface Relation {
  [key: string]: Edge;
}
