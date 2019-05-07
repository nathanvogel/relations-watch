import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import * as d3 from "d3";

import { RelationRenderData, NodeRenderData } from "../utils/types";
import ROUTES from "../utils/ROUTES";

const GraphSVG = styled.svg`
  display: block;
  margin: 0 auto;
`;

type Props = {
  rRelations: RelationRenderData[];
  rEntities: NodeRenderData[];
  width: number;
  height: number;
} & RouteComponentProps;

const colours = ["#f92035", "#0423e8", "#0480e8"];
const sizes = [38, 28, 18];

class GraphD3Simple extends React.Component<Props> {
  private svgEl: React.RefObject<SVGSVGElement>;

  constructor(props: Readonly<Props>) {
    super(props);
    this.svgEl = React.createRef();
  }

  componentDidMount() {
    this.updateStyleAndAttrs();
  }

  componentDidUpdate() {
    this.updateStyleAndAttrs();
  }

  updateStyleAndAttrs() {
    let u = (d3
      .select(this.svgEl.current)
      .selectAll("circle")
      .data(this.props.rEntities) as unknown) as d3.Selection<
      SVGCircleElement,
      NodeRenderData,
      SVGSVGElement | null,
      {}
    >;

    u.enter()
      .append("circle")
      .merge(u)
      .on("click", this.onNodeClick)
      .transition()
      .duration(1000)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => sizes[d.type])
      .style("fill", d => colours[d.type]);

    u.exit().remove();
  }

  onNodeClick = (d: NodeRenderData, _index: number) => {
    this.props.history.push(`/${ROUTES.entity}/${d.entityKey}`);
  };

  render() {
    const { rRelations, rEntities } = this.props;
    return (
      <GraphSVG
        width={800}
        height={800}
        xmlns="http://www.w3.org/2000/svg"
        ref={this.svgEl}
      />
    );
  }
}

export default withRouter(GraphD3Simple);
