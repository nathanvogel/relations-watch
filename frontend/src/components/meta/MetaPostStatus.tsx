import React from "react";
import { Status, ErrorPayload } from "../../utils/types";

interface Props {
  status?: Status;
  error?: ErrorPayload;
  isGet?: boolean;
  className?: string;
}

export default function MetaPostStatus(props: Props) {
  const { status, error, isGet } = props;
  return (
    <React.Fragment>
      {status === Status.Requested && (
        <p className={props.className}>{isGet ? "Loading..." : "Saving..."}</p>
      )}
      {status === Status.Error && (
        <p className={props.className}>
          Error: {error ? error.eMessage : "Unkown error"}
        </p>
      )}
    </React.Fragment>
  );
}
