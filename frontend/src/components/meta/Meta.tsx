import React from "react";
import { Status, ErrorPayload } from "../../utils/types";

interface MetaProps {
  status?: Status | null;
  error?: ErrorPayload | null;
  className?: string;
}

export default function Meta(props: MetaProps) {
  switch (props.status) {
    case undefined:
    case null:
      return <span className={props.className}>Initializing...</span>;
    case Status.Requested:
      return <span className={props.className}>Loading...</span>;
    case Status.Error:
      if (props.error)
        return (
          <span className={props.className}>Error: {props.error.eMessage}</span>
        );
      else return <span className={props.className}>Unknown error</span>;
    default:
      return null;
  }
}
