import React from "react";
import { RouteComponentProps } from "react-router-dom";
import EntityEditor from "../components/EntityEditor";

interface EntityMatch {
  entityKey?: string;
}

export function CreateEntityScreen(props: RouteComponentProps) {
  const { entityKey } = props.match.params as EntityMatch;
  return <EntityEditor {...props} entityKey={entityKey} />;
}
