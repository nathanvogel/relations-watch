import React from "react";
import { Status, ErrorPayload } from "../../utils/types";

interface Props {
  status?: Status;
  error?: ErrorPayload;
}

export default function MetaPostStatus(props: Props) {
  const { status, error } = props;
  return (
    <React.Fragment>
      {status === Status.Requested && <p>Saving...</p>}
      {status === Status.Error && (
        <p>Error: {error ? error.eMessage : "Unkown error"}</p>
      )}
    </React.Fragment>
  );
}
