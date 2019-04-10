import React from "react";
import { Status, ErrorPayload } from "../utils/types";

interface MetaProps {
  status?: Status | null;
  error?: ErrorPayload | null;
}

export default function Meta(props: MetaProps) {
  switch (props.status) {
    case undefined:
    case null:
      return <span>Initializing...</span>;
    case Status.Requested:
      return <span>Loading...</span>;
    case Status.Error:
      if (props.error) return <span>Error: {props.error.eMessage}</span>;
      else return <span>Unknown error</span>;
    default:
      return null;
  }
}
