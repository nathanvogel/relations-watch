import React from "react";
import { EntityPreview, Entity } from "../../utils/types";
import DefaultPerson from "../../assets/physical_p_default_preview_48.png";
import PrimaryDefaultPerson from "../../assets/physical_p_default_preview_56.png";

type OwnProps = {
  entity: EntityPreview | Entity;
  x: number;
  y: number;
  scale: number;
  textScale: number;
  primary: boolean;
  visited: boolean;
};

class GraphEntityNode extends React.Component<OwnProps> {
  static defaultProps = {
    scale: 1,
    textScale: 1,
    primary: false
  };

  render() {
    // This should be able to handle an entity with only a _key attribute
    // (in case it's still loading)
    const { entity, x, y, scale, textScale, primary, visited } = this.props;
    const size = primary ? 52 : 40 * scale;
    const fontSize = 12 * textScale;

    return (
      <g className="node" id={entity._key}>
        <image
          opacity="1"
          href={primary ? PrimaryDefaultPerson : DefaultPerson}
          width={size}
          height={size}
        />
        {/* Print a first time the text with a big stroke, it's a hack
            to display a background the size of the text. */}
        <text
          textAnchor="middle"
          dy="1.0em"
          fontSize={fontSize}
          fontWeight={primary ? "bold" : "normal"}
          stroke={visited ? "#FFF59F" : "#ffffff"}
          strokeWidth="0.6em"
          opacity="0.8"
          transform={`translate(${size / 2},${size})`}
        >
          {entity.name}
        </text>
        <text
          textAnchor="middle"
          dy="1.0em"
          fill="black"
          fontSize={fontSize}
          fontWeight={primary ? "bold" : "normal"}
          opacity="1"
          transform={`translate(${size / 2},${size})`}
        >
          {entity.name}
        </text>
      </g>
    );
  }
}

export default GraphEntityNode;
