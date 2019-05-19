import React from "react";
import styled from "styled-components";

import { Edge } from "../utils/types";
import EdgeDetails from "./EdgeDetails";

const Content = styled.div`
  width: 100%;
`;

type OwnProps = {
  relations: Edge[];
};

class RelationEdgesList extends React.Component<OwnProps> {
  render() {
    const { relations } = this.props;

    if (!relations)
      return (
        <Content>
          <p>The list of edges is empty.</p>
        </Content>
      );

    return (
      <Content>
        {relations
          .sort((a, b) => parseInt(b._key || "0") - parseInt(a._key || "0"))
          .map(relation => (
            <EdgeDetails key={relation._key} edge={relation} />
          ))}
      </Content>
    );
  }
}

export default RelationEdgesList;
