import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import * as d3 from "d3";
import "d3-force";
import { SimulationNodeDatum, SimulationLinkDatum } from "d3-force";
import forceBoundary from "../utils/d3/d3-force-boundary";

import {
  RelationRenderData,
  NodeRenderData,
  NodeRenderType,
  RelationType
} from "../utils/types";
import ROUTES from "../utils/ROUTES";
import { getEntitySAsset } from "../assets/EntityIcons";
import { RELATION_COLORS } from "../utils/theme";
import { DirectedLinks } from "../utils/consts";

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
// const sizes = [38, 28, 18];

const COLL_RADIUS = 2;

function size(d: NodeRenderData): number {
  return sizeT(d.type);
}
function sizeT(type: NodeRenderType): number {
  switch (type) {
    case NodeRenderType.Primary:
      return 45;
    case NodeRenderType.Secondary:
      return 35;
    case NodeRenderType.Tertiary:
      return 25;
  }
}
function collisionSize(d: NodeRenderData): number {
  switch (d.type) {
    case NodeRenderType.Primary:
      return 80;
    case NodeRenderType.Secondary:
      return 66;
    case NodeRenderType.Tertiary:
      return 42;
  }
}

function isDirectedType(t: RelationType) {
  return DirectedLinks.indexOf(t) >= 0;
}

function nodeTranslate(d: NodeRenderData): string {
  return `translate(
    ${(d.x as number) - size(d) / 2},
    ${(d.y as number) - size(d) / 2 - 5})`;
}

function fontWeight(d: NodeRenderData): string {
  switch (d.type) {
    case NodeRenderType.Primary:
      return "bold";
    case NodeRenderType.Secondary:
      return "normal";
    case NodeRenderType.Tertiary:
      return "normal";
  }
}

function fontSize(d: NodeRenderData): number {
  switch (d.type) {
    case NodeRenderType.Primary:
      return 14;
    case NodeRenderType.Secondary:
      return 14;
    case NodeRenderType.Tertiary:
      return 12;
  }
}

function href(d: NodeRenderData): string {
  return getEntitySAsset(d.entity.type);
}

function relationColor(d: RelationRenderData) {
  return RELATION_COLORS[d.types[0]];
}

function strokeColor(d: RelationRenderData) {
  return d.withType === NodeRenderType.Primary ? "#888888" : "#dddddd";
}

function linkOpacity(d: RelationRenderData) {
  return d.withType === NodeRenderType.Primary ? 1 : 0.5;
}

function goToParent(this: Element | null) {
  if (!this) return null;
  return this.parentNode as any;
}

function between(a1: number, a2: number, percent: number) {
  return a1 + (a2 - a1) * percent;
}
function betweenOffD(d: RelationRenderData, offset: number) {
  const source = d.source as SimulationNodeDatum;
  const target = d.target as SimulationNodeDatum;

  return betweenOff(
    source.x as number,
    source.y as number,
    target.x as number,
    target.y as number,
    offset
  );
}
function betweenOff(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  offset: number
) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  return {
    x: x2 - offset * Math.cos(angle),
    y: y2 - offset * Math.sin(angle)
  };
}

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

    this.simulation = d3.forceSimulation();
    // .force("link", d3.forceLink().id(d => (d as NodeRenderData).entityKey))
    // .force("charge", d3.forceManyBody())
    // .force("collide", d3.forceCollide().radius(collisionSize as any))
    // .force("center", d3.forceCenter(width / 2, height / 2))
    // .force("boundary", forceBoundary(0, 0, width, height)) as any;
  }

  componentDidMount() {
    this.updateGraph();
  }

  componentDidUpdate() {
    this.updateGraph();
  }

  updateGraph() {
    // PREPARE DATA

    // Create a deep copy of the props and merges it to our existing data
    // We do this to preserve the positions and velocities from one
    // screen to the next.
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
      // this.nodesData[key].x = this.nodesData[key].x || width / 2 - 200;
      // this.nodesData[key].y = this.nodesData[key].y || height;
      // this.nodesData[key].fx = this.nodesData[key].type === NodeRenderType.Primary ? width / 2 : undefined;
      // this.nodesData[key].fy = this.nodesData[key].type === NodeRenderType.Primary ? height / 2 : undefined;
      rEntities.push(this.nodesData[key]);
    }

    // D3 FORCES SETUP

    const maxTypes = d3.max(rRelations, d => d.types.length) || 1;
    const distScale = d3
      .scaleLinear()
      .domain([1, Math.max(maxTypes, 3)])
      .range([250, 100]);
    // We need to recreate the simulation for some reason... ?
    const { width, height } = this.props;
    this.simulation = d3
      .forceSimulation()
      .velocityDecay(0.82) // Akin to atmosphere friction (velocity multiplier)
      .alphaTarget(-0.1) // Stop mini-pixel-step-motion early
      // The most important force, attraction derived from our relations.
      .force(
        "link",
        d3
          .forceLink()
          .id(d => (d as NodeRenderData).entityKey)
          .strength(1) // Warning: crashes if higher than 2, better stay within [0,1]
          // Make some links closer than others.
          .distance((d: any) => distScale(d.types.length))
          // Emphasize this force and arrive faster at a stable result
          .iterations(8)
      )
      // Makes nodes repulse each other
      .force("charge", d3.forceManyBody().strength(-800))
      // Keep the whole graph centered
      .force("center", d3.forceCenter(width / 2, height / 2))
      // Put the primary entity at the center of the graph
      // TODO: Make it distribute the secondary nodes depending on the type of
      // relationship.
      .force(
        "x",
        d3
          .forceX(width / 2)
          .strength((d: any) =>
            (d as NodeRenderData).type === NodeRenderType.Primary ? 1 : 0
          )
      )
      .force(
        "y",
        d3
          .forceY(height / 2)
          .strength((d: any) =>
            (d as NodeRenderData).type === NodeRenderType.Primary ? 1 : 0
          )
      )
      // Pushes Tertiary entities towards an outer circle
      .force(
        "radial",
        d3
          .forceRadial(Math.min(width, height) * 0.4, width / 2, height / 2)
          .strength((d: any) =>
            (d as NodeRenderData).type === NodeRenderType.Tertiary ? 1 : 0
          )
      )
      // Alternative or helper to forceManyBody()
      .force(
        "collide",
        d3
          .forceCollide()
          .radius(collisionSize as any)
          .strength(0.2)
      )
      // Keep all nodes within our canvas
      .force("boundary", forceBoundary(0, 0, width, height)) as any;

    // Alternative to forceBoundary() taken from
    // https://observablehq.com/@d3/disjoint-force-directed-graph
    // .force("x", d3.forceX())
    // .force("y", d3.forceY())

    // D3 RENDERING starts here

    // LINKS rendering
    var linkGroup = d3.select(this.gLinks.current);
    var links = linkGroup.selectAll("g").data(
      () => rRelations,
      // Key function to preserve the relation between DOM and rRelations
      (d: RelationRenderData | {}) => (d as RelationRenderData).relationId
    );
    var links2 = links
      .enter()
      .append("g")
      .attr("class", "relation")
      .append("line")
      .classed("visual", true)
      .attr("stroke-width", 1)
      .attr("stroke", relationColor)
      .select(goToParent)
      .append("circle")
      .attr("r", 4)
      .attr("fill", relationColor)
      .attr("stroke-width", 0)
      .attr("stroke", "#aaaaaa")
      .attr("opacity", d => (isDirectedType(d.types[0]) ? 1 : 0))
      .select(goToParent)
      .append("line")
      .classed("interaction", true)
      .attr("stroke-width", 11)
      .attr("opacity", 0)
      .on("click", this.onRelationClick)
      .on("mouseover", function(d) {
        d3.select(this.parentNode as any)
          .select(".visual")
          .attr("stroke-width", 8);
      })
      .on("mouseout", function(d) {
        d3.select(this.parentNode as any)
          .select(".visual")
          .attr("stroke", relationColor as any)
          .attr("stroke-width", 1);
      })
      .select(goToParent)
      .merge(links as any);
    var linksVisual = links2.select("line.visual").attr("opacity", linkOpacity);
    var linksInteraction = links2
      .select("line.interaction")
      .attr("stroke", d => (d.visited ? "#E6E2FF" : "transparent"));
    var linksC = links2.select("circle"); //.attr("opacity", linkOpacity);
    links.exit().remove();

    // NODES rendering
    var nodeGroup = d3.select(this.gNodes.current);
    var nodes = nodeGroup.selectAll("g.node").data(
      () => rEntities,
      // Key function to preserve the relation between DOM and rEntities
      (d: NodeRenderData | {}) => (d as NodeRenderData).entityKey
    );
    // Add nodes for the first time and define one-time attribute.
    var nodes2 = nodes
      .enter()
      .append("g")
      .classed("node", true)
      .classed("interaction", true)
      // .attr("transform", "scale(0.2, 0.2)")
      .on("click", this.onNodeClick)
      // Add the text background
      .append("rect")
      .attr("opacity", 0.76)
      .select(goToParent)
      // Add the text child
      .append("text")
      .text(d => d.entity.name)
      .attr("text-anchor", "middle")
      .attr("dy", "18px")
      .attr("fill", "#000000")
      .select(goToParent)
      // Add the image child
      .append("image")
      .attr("href", href)
      .select(goToParent)
      // General Update Pattern: Tell all to update with animation.
      .merge(nodes as any);
    // Update dynamic attributes for all nodes:
    nodes2
      .select("text")
      .attr("font-size", fontSize)
      .attr("font-weight", fontWeight)
      .attr("transform", d => `translate(${size(d) / 2},${size(d)})`);
    nodes2
      .select("image")
      .attr("width", size)
      .attr("height", size);
    // Get the text size and resize the background
    // Code from: http://bl.ocks.org/andreaskoller/7674031
    nodes2.select("text").each(function(d, _index) {
      // get bounding box of text field and store it in texts array
      d.bb = (this as SVGTextElement).getBBox();
    });
    var paddingLR = 4; // adjust the padding values depending on font and font size
    var paddingTB = 2;
    nodes2
      .select("rect")
      .attr("x", (d: any) => -d.bb.width / 2 - paddingLR / 2 + size(d) / 2)
      .attr("y", (d: any) => size(d) + 2 + paddingTB / 2)
      .attr("width", (d: any) => d.bb.width + paddingLR)
      .attr("height", (d: any) => d.bb.height + paddingTB)
      .attr("fill", d => (d.visited ? "#E6E2FF" : "#ffffff"));
    // Transition IN
    // nodes2
    //   .select("image")
    //   .transition()
    //   .duration(300)
    //   .attr("transform", "scale(1, 1)");
    // Transition OUT
    nodes
      .exit()
      .transition()
      .duration(300)
      .attr("transform", d => nodeTranslate(d as any) + " scale(0,0)")
      .remove();

    // Update the positions from the simulation
    this.simulation.on("tick", () => {
      linksVisual
        .attr("x1", d => (d.source as SimulationNodeDatum).x as number)
        .attr("y1", d => (d.source as SimulationNodeDatum).y as number)
        .attr("x2", d => (d.target as SimulationNodeDatum).x as number)
        .attr("y2", d => (d.target as SimulationNodeDatum).y as number);
      linksInteraction
        .attr("x1", d => (d.source as SimulationNodeDatum).x as number)
        .attr("y1", d => (d.source as SimulationNodeDatum).y as number)
        .attr("x2", d => (d.target as SimulationNodeDatum).x as number)
        .attr("y2", d => (d.target as SimulationNodeDatum).y as number);

      linksC
        .attr("cx", (d: any) => between(d.source.x, d.target.x, 0.15))
        .attr("cy", (d: any) => between(d.source.y, d.target.y, 0.15));
      // linksC
      //   .attr("cx", d => betweenOffD(d, 20).x)
      //   .attr("cy", d => betweenOffD(d, 15).y);

      // With circle:
      // nodes2.attr("cx", d => d.x as number).attr("cy", d => d.y as number);
      nodes2.attr("transform", nodeTranslate);
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

  onRelationClick = (d: RelationRenderData, _index: number) => {
    this.props.history.push(`/${ROUTES.relation}/${d.from}/${d.to}`);
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
