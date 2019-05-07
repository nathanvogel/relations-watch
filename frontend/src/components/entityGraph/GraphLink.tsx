import React from "react";

import { RelationRenderData } from "../../utils/types";
import { RELATION_COLORS } from "../../utils/consts";

type OwnProps = {
  data: RelationRenderData;
};

class GraphLink extends React.Component<OwnProps> {
  render() {
    const { x1, y1, x2, y2, types, relationId } = this.props.data;
    const angle = Math.atan2(x2 - x1, y2 - y1);
    const angleDeg = -(angle * 180) / Math.PI + 90;
    const length = Math.hypot(x2 - x1, y2 - y1);
    const dx: number[] = [];
    const dy: number[] = [];
    for (let i = 0; i < types.length; i += 1) {
      const offset = i - (types.length - 1) / 2;
      dx.push(0); // = Math.sin(angle + 90) * offset * 3
      dy.push(offset * 3);
    }

    return (
      <g className="relation" id={relationId}>
        <line
          x1={0}
          y1={0}
          x2={1}
          y2={0}
          stroke="transparent"
          strokeWidth={15}
        />
        {types.map((type, index) => (
          <line
            key={type}
            x1={0 + dx[index]}
            y1={0 + dy[index]}
            x2={1 + dx[index]}
            y2={0 + dy[index]}
            stroke={RELATION_COLORS[type]}
            strokeWidth={1.5}
          />
        ))}
      </g>
    );
  }
}

export default GraphLink;
