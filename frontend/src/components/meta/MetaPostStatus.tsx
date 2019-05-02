import React from "react";
import { Status, ErrorPayload } from "../../utils/types";

interface Props {
  status?: Status;
  error?: ErrorPayload;
  isGet?: boolean;
}

export default function MetaPostStatus(props: Props) {
  const { status, error, isGet } = props;
  return (
    <React.Fragment>
      {status === Status.Requested && (
        <p>{isGet ? "Loading..." : "Saving..."}</p>
      )}
      {status === Status.Error && (
        <p>Error: {error ? error.eMessage : "Unkown error"}</p>
      )}
    </React.Fragment>
  );
}
