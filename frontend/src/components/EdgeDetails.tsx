import React from "react";
import { Edge } from "../utils/types";

type Props = {
  edge: Edge;
};

class EdgeDetails extends React.Component<Props> {
  render() {
    const { edge } = this.props;
    return <div>{edge.text}</div>;
  }
}

export default EdgeDetails;
