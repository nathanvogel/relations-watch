import React from "react";

import { RelationType, Entity, Edge } from "../../utils/types";
import { getEdgeSummary } from "../../strings/getEdgeSummary";

type Props = {
  edge: Edge;
  entityFrom: Entity;
  entityTo: Entity;
};

const EdgeSummary: React.FunctionComponent<Props> = (props: Props) => {
  if (props.edge.type === RelationType.Other) return null;
  return (
    <span>{getEdgeSummary(props.edge, props.entityFrom, props.entityTo)}</span>
  );
};

export default EdgeSummary;
