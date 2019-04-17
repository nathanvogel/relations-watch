import React from "react";
import { EntityPreview } from "../utils/types";
import ROUTES from "../utils/ROUTES";
import { Link } from "react-router-dom";
import DefaultPerson from "../assets/person-default_48.png";
import PrimaryDefaultPerson from "../assets/person-default_56.png";

type OwnProps = {
  entity: EntityPreview;
  baseEntityKey?: string;
  x: number;
  y: number;
  scale: number;
  textScale: number;
  primary: boolean;
};

class GraphEntityNode extends React.Component<OwnProps> {
  static defaultProps = {
    scale: 1,
    textScale: 1,
    primary: false
  };

  render() {
    const {
      entity,
      x,
      y,
      scale,
      textScale,
      baseEntityKey,
      primary
    } = this.props;
    const size = primary ? 52 : 40 * scale;
    const fontSize = 12 * textScale;

    const svgNode = (
      <g
        className="node"
        id={entity._key}
        transform={`translate(${x - size / 2},${y - size / 2 - 5})`}
      >
        <image
          opacity="1"
          href={primary ? PrimaryDefaultPerson : DefaultPerson}
          width={size}
          height={size}
        />
        <text
          dx="15.5"
          dy=".35em"
          fill="black"
          font-size={fontSize}
          font-weight={primary ? "bold" : "normal"}
          opacity="1"
          transform={`translate(${-size / 2},${size + 8})`}
        >
          {entity.name}
        </text>
      </g>
    );

    // Only wrap in a link if we aren't the base entity.
    return baseEntityKey ? (
      <Link to={`/${ROUTES.relation}/${baseEntityKey}/${entity._key}`}>
        {svgNode}
      </Link>
    ) : (
      svgNode
    );
  }
}

export default GraphEntityNode;
