import React from "react";

import { LinkRenderData } from "../utils/types";

type OwnProps = {
  data: LinkRenderData;
};

class GraphLink extends React.Component<OwnProps> {
  render() {
    const { x1, y1, x2, y2, angle, types, entityKey } = this.props.data;
    const coords = { x1, y1, x2, y2 };

    return (
      <g id={"edges-" + entityKey}>
        <line {...coords} stroke="#999" strokeWidth={2} />
      </g>
    );
  }
}

export default GraphLink;
