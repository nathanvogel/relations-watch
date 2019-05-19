import React from "react";
import { Status, ErrorPayload } from "../../utils/types";
import IconButton from "../buttons/IconButton";

interface Props {
  status?: Status;
  error?: ErrorPayload;
  isGet?: boolean;
  className?: string;
  clearRequest?: () => void;
}

export default function MetaPostStatus(props: Props) {
  const { status, error, isGet, clearRequest } = props;
  return (
    <React.Fragment>
      {status === Status.Requested && (
        <p className={props.className}>{isGet ? "Loading..." : "Saving..."}</p>
      )}
      {status === Status.Error && (
        <React.Fragment>
          <p className={props.className}>
            Error: {error ? error.eMessage : "Unkown error"}
          </p>
          {clearRequest && <IconButton onClick={clearRequest}>Ok</IconButton>}
        </React.Fragment>
      )}
      {status === Status.Ok && (
        <React.Fragment>
          <p className={props.className}>Successfully saved!</p>
          {clearRequest && <IconButton onClick={clearRequest}>Ok</IconButton>}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
