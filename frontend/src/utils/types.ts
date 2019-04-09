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
