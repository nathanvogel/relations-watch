import React from "react";

import { LinkRenderData } from "../utils/types";
import { RELATION_COLORS } from "../utils/consts";

type OwnProps = {
  data: LinkRenderData;
};

class GraphLink extends React.Component<OwnProps> {
  render() {
    const { x1, y1, x2, y2, angle, types, entityKey } = this.props.data;
    const dx: number[] = [];
    const dy: number[] = [];
    for (let i = 0; i < types.length; i += 1) {
      const offset = i - (types.length - 1) / 2; // % 2 === 0 ? -i / 2 : (i + 1) / 2;
      dx.push(Math.sin(angle + 90) * offset * 3);
      dy.push(Math.cos(angle + 90) * offset * 3);
    }

    return (
      <g id={"edges-" + entityKey}>
        {types.map((type, index) => (
          <line
            key={type}
            x1={x1 + dx[index]}
            y1={y1 + dy[index]}
            x2={x2 + dx[index]}
            y2={y2 + dy[index]}
            stroke={RELATION_COLORS[type]}
            strokeWidth={1.5}
          />
        ))}
      </g>
    );
  }
}

export default GraphLink;
