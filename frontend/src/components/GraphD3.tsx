import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import * as d3 from "d3";
import "d3-force";

import {
  RelationRenderData,
  NodeRenderData,
  NodeRenderType
} from "../utils/types";
import ROUTES from "../utils/ROUTES";
import GraphEntityNode from "./entityGraph/GraphEntityNode";
import GraphLink from "./entityGraph/GraphLink";

const GraphSVG = styled.svg`
  display: block;
  margin: 0 auto;
`;

type Props = {
  rRelations: RelationRenderData[];
  rEntities: NodeRenderData[];
  width: number;
  height: number;
};

class GraphD3 extends React.Component<Props> {
  private svgEl: React.RefObject<SVGSVGElement>;

  constructor(props: Readonly<Props>) {
    super(props);
    this.svgEl = React.createRef();
  }

  componentDidMount() {
    console.log("MOUNT");
    this.updateStyleAndAttrs();
  }

  componentDidUpdate() {
    this.updateStyleAndAttrs();
  }

  updateStyleAndAttrs() {
    let maxRadius = 40;
    let xScale = d3
      .scaleLinear()
      .domain([0, this.props.width])
      .range([0, this.props.width]);
    let yScale = d3
      .scaleLinear()
      .domain([0, this.props.height])
      .range([0, this.props.height]);

    d3.select(this.svgEl.current)
      .selectAll("g.node")
      .data(this.props.rEntities)
      .transition()
      .duration(1000)
      .attr("transform", d => `translate(${d.x - 20},${d.y - 20})`);

    // d3.select(this.svgEl.current)
    //   .selectAll("g.relation")
    //   .data(this.props.rRelations)
    //   .transition()
    //   .duration(1000)
    //   .attr("transform", (d, i, groups) => `translate(${ - 20},${d.y - 40})`);

    // .attr("cx", d => xScale(d.x))
    // .attr("cy", d => yScale(d.y))
    // .attr("r", d => rScale(d.r))
    // .style("fill", d => colours[d.colour]);
  }

  render() {
    const { rRelations, rEntities } = this.props;
    return (
      <GraphSVG
        width={800}
        height={800}
        xmlns="http://www.w3.org/2000/svg"
        ref={this.svgEl}
      >
        >
        {rRelations.map(rRelation => (
          <Link
            key={rRelation.relationId}
            to={`/${ROUTES.relation}/${rRelation.from}/${rRelation.to}`}
          >
            <GraphLink data={rRelation} />
          </Link>
        ))}
        {rEntities.map(d => (
          <Link key={d.entityKey} to={`/${ROUTES.entity}/${d.entityKey}`}>
            <GraphEntityNode
              entity={d.entity}
              x={d.x}
              y={d.y}
              primary={d.type === NodeRenderType.Primary}
              visited={d.visited}
            />
          </Link>
        ))}
      </GraphSVG>
    );
  }
}

export default GraphD3;
