import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import * as d3 from "d3";
import "d3-force";
import { SimulationNodeDatum, SimulationLinkDatum } from "d3-force";
import forceBoundary from "../utils/d3/d3-force-boundary";

import { RelationRenderData, NodeRenderData } from "../utils/types";
import ROUTES from "../utils/ROUTES";

const GraphSVG = styled.svg`
  display: block;
  margin: 0 auto;
`;

type Props = {
  rRelations: RelationRenderData[];
  rEntities: NodeRenderData[];
  rRelationsByKey: { [key: string]: RelationRenderData };
  rEntitiesByKey: { [key: string]: NodeRenderData };
  width: number;
  height: number;
} & RouteComponentProps;

const colours = ["#f92035", "#0423e8", "#0480e8"];
const coloursVisited = ["#a92035", "#0423a8", "#0480a8"];
const sizes = [38, 28, 18];

class GraphD3Simple extends React.Component<Props> {
  private svgEl: React.RefObject<SVGSVGElement>;
  private gLinks: React.RefObject<SVGGElement>;
  private gNodes: React.RefObject<SVGGElement>;
  private simulation: d3.Simulation<
    NodeRenderData,
    SimulationLinkDatum<NodeRenderData>
  >;
  private nodesData: { [key: string]: NodeRenderData } = {};
  private linksData: { [key: string]: RelationRenderData } = {};

  constructor(props: Readonly<Props>) {
    super(props);
    this.svgEl = React.createRef();
    this.gLinks = React.createRef();
    this.gNodes = React.createRef();

    const { width, height } = props;
    this.simulation = d3
      .forceSimulation()
      .force("link", d3.forceLink().id(d => (d as NodeRenderData).entityKey))
      .force("charge", d3.forceManyBody())
      .force(
        "collide",
        d3.forceCollide().radius(d => sizes[(d as NodeRenderData).type] * 2)
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("boundary", forceBoundary(0, 0, width, height)) as any;
  }

  componentDidMount() {
    this.updateGraph();
  }

  componentDidUpdate() {
    this.updateGraph();
  }

  updateGraph() {
    // We need to recreate the simulation for some reason... ?
    const { width, height } = this.props;
    this.simulation = d3
      .forceSimulation()
      .force("link", d3.forceLink().id(d => (d as NodeRenderData).entityKey))
      .force("charge", d3.forceManyBody())
      .force(
        "collide",
        d3.forceCollide().radius(d => sizes[(d as NodeRenderData).type] * 2)
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("boundary", forceBoundary(0, 0, width, height)) as any;

    // Create a deep copy of the props and merges it to our existing data
    const { rEntitiesByKey, rRelationsByKey } = this.props;
    var rRelations: RelationRenderData[] = [];
    for (let key in rRelationsByKey) {
      this.linksData[key] = this.linksData[key]
        ? Object.assign({}, this.linksData[key], rRelationsByKey[key])
        : Object.assign({}, rRelationsByKey[key]);
      rRelations.push(this.linksData[key]);
    }
    var rEntities: NodeRenderData[] = [];
    for (let key in rEntitiesByKey) {
      this.nodesData[key] = this.nodesData[key]
        ? Object.assign({}, this.nodesData[key], rEntitiesByKey[key])
        : Object.assign({}, rEntitiesByKey[key]);
      // this.nodesData[key].fx = this.nodesData[key].type === NodeRenderType.Primary ? width / 2 : undefined;
      // this.nodesData[key].fy = this.nodesData[key].type === NodeRenderType.Primary ? height / 2 : undefined;
      rEntities.push(this.nodesData[key]);
    }

    var linkGroup = d3.select(this.gLinks.current);
    var links = linkGroup.selectAll("line").data(
      () => rRelations,
      // Key function to preserve the relation between DOM and rRelations
      (d: RelationRenderData | {}) => (d as RelationRenderData).relationId
    );
    var links2 = links
      .enter()
      .append("line")
      .attr("stroke", "#555555")
      .merge(links as any);
    links.exit().remove();

    var nodeGroup = d3.select(this.gNodes.current);
    var nodes = nodeGroup.selectAll("circle").data(
      () => rEntities,
      // Key function to preserve the relation between DOM and rEntities
      (d: NodeRenderData | {}) => (d as NodeRenderData).entityKey
    );
    var nodes2 = nodes
      // Add nodes for the first time and define one-time attribute.
      .enter()
      .append("circle")
      .on("click", this.onNodeClick)
      // Add a child
      .append("title")
      .text(d => d.entity.name)
      // <- back to parent
      .select(function() {
        return this.parentNode as any;
      })
      // General Update Pattern: Tell all to update with animation.
      .merge(nodes as any);
    nodes2
      .transition()
      .duration(300)
      .attr("r", d => sizes[d.type])
      .style("fill", d =>
        d.visited ? coloursVisited[d.type] : colours[d.type]
      );
    // .call(d3.drag()
    //     .on("start", dragstarted)
    //     .on("drag", dragged)
    //     .on("end", dragended) as any);
    nodes
      .exit()
      .transition()
      .duration(300)
      .attr("x", -50)
      .attr("r", 0)
      .remove();

    // Update the positions from the simulation
    this.simulation.on("tick", () => {
      links2
        .attr("x1", d => (d.source as SimulationNodeDatum).x as number)
        .attr("y1", d => (d.source as SimulationNodeDatum).y as number)
        .attr("x2", d => (d.target as SimulationNodeDatum).x as number)
        .attr("y2", d => (d.target as SimulationNodeDatum).y as number);

      nodes2.attr("cx", d => d.x as number).attr("cy", d => d.y as number);
    });

    // Update the data in the simulation.
    this.simulation.nodes(rEntities);
    const linkForce = this.simulation.force("link") as d3.ForceLink<
      {},
      d3.SimulationLinkDatum<{}>
    >;
    linkForce.links(rRelations);

    // this.simulation.restart();
  }

  onNodeClick = (d: NodeRenderData, _index: number) => {
    this.props.history.push(`/${ROUTES.entity}/${d.entityKey}`);
  };

  render() {
    return (
      <GraphSVG
        width={800}
        height={800}
        xmlns="http://www.w3.org/2000/svg"
        ref={this.svgEl}
      >
        <g className="links" ref={this.gLinks} />
        <g className="nodes" ref={this.gNodes} />
      </GraphSVG>
    );
  }
}

export default withRouter(GraphD3Simple);
