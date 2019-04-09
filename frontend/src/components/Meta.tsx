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
      return <p>Initializing...</p>;
    case Status.Requested:
      return <p>Loading...</p>;
    case Status.Error:
      if (props.error) return <p>Error: {props.error.eMessage}</p>;
      else return <p>Unknown error</p>;
    default:
      return null;
  }
}
