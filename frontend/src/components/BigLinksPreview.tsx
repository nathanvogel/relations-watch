import React from "react";
import styled from "styled-components";

import { Edge } from "../utils/types";
import CONSTS from "../utils/consts";

const Header = styled.header`
  min-height: 200px;
  padding-top: 60px;
`;

const VisualEdge = styled.div`
  width: 120%;
  position: relative;
  left: -10%;
  z-index: -10;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${props => props.color}
  margin-bottom: 2px;
`;

type OwnProps = {
  relations: Edge[];
};

/**
 * Should render something even if props.relations is empty.
 * To keep height consistent and show the loading state below.
 * @extends React
 */
class BigLinksPreview extends React.Component<OwnProps> {
  render() {
    const { relations } = this.props;

    // Find unique types
    const types = [];
    for (let i = 0; i < relations.length; i++) {
      const link = relations[i];
      if (types.indexOf(link.type) < 0) types.push(link.type);
    }
    types.sort((a, b) => a - b);
    console.log(types);

    return (
      <Header>
        {types.map((type, index) => (
          <VisualEdge key={type} color={CONSTS.RELATION_COLORS[type]} />
        ))}
      </Header>
    );
  }
}

export default BigLinksPreview;
