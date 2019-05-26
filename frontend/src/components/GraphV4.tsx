import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import * as d3 from "d3";
import "d3-force";
//@ts-ignore
import { forceCluster } from "d3-force-cluster";
import forceBoundary from "../utils/d3/d3-force-boundary";
import {
  V4LinkDatum,
  V4NodeDatum,
  NodeRenderType,
  RelationType,
  RelZone,
  Clusters,
} from "../utils/types";
import ROUTES from "../utils/ROUTES";
import { getEntitySAsset } from "../assets/EntityIcons";
import theme, { RELATION_COLORS } from "../styles/theme";
import { DirectedLinks } from "../utils/consts";
import "./GraphV4.css";

const GraphSVG = styled.svg`
  display: block;
  margin: 0 auto;
`;

type Props = {
  rRelations: V4LinkDatum[];
  rEntities: V4NodeDatum[];
  rRelationsByKey: { [key: string]: V4LinkDatum };
  rEntitiesByKey: { [key: string]: V4NodeDatum };
  width: number;
  height: number;
} & RouteComponentProps;

function size(d: V4NodeDatum): number {
  return sizeT(d.type);
}
function sizeT(type: NodeRenderType): number {
  switch (type) {
    case NodeRenderType.Primary:
      return 35;
    case NodeRenderType.Secondary:
      return 35;
    case NodeRenderType.Tertiary:
      return 25;
  }
}
function collisionSize(d: V4NodeDatum): number {
  switch (d.type) {
    case NodeRenderType.Primary:
      return 42;
    case NodeRenderType.Secondary:
      return 42;
    case NodeRenderType.Tertiary:
      return 42;
  }
}

function isDirectedType(t: RelationType) {
  return DirectedLinks.indexOf(t) >= 0;
}

function nodeTranslate(d: V4NodeDatum): string {
  return `translate(
    ${d.x - size(d) / 2},
    ${d.y - size(d) / 2 - 5})`;
}

function fontWeight(d: V4NodeDatum): string {
  switch (d.type) {
    case NodeRenderType.Primary:
      return "bold";
    case NodeRenderType.Secondary:
      return "normal";
    case NodeRenderType.Tertiary:
      return "normal";
  }
}

function fontSize(d: V4NodeDatum): number {
  switch (d.type) {
    case NodeRenderType.Primary:
      return 13;
    case NodeRenderType.Secondary:
      return 13;
    case NodeRenderType.Tertiary:
      return 12;
  }
}

function href(d: V4NodeDatum): string {
  return getEntitySAsset(d.entity.type);
}

function relationColor(d: V4LinkDatum) {
  return RELATION_COLORS[d.sortedTypes[0]];
}

function strokeColor(d: V4LinkDatum) {
  return d.withType === NodeRenderType.Primary ? "#888888" : "#dddddd";
}

function linkOpacity(d: V4LinkDatum) {
  return d.withType === NodeRenderType.Primary ? 1 : 0.5;
}

function goToParent(this: Element | null) {
  if (!this) return null;
  return this.parentNode as any;
}

function between(a1: number, a2: number, percent: number) {
  return a1 + (a2 - a1) * percent;
}
function betweenOffD(d: V4LinkDatum, offset: number) {
  const source = d.source as V4NodeDatum;
  const target = d.target as V4NodeDatum;

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
    y: y2 - offset * Math.sin(angle),
  };
}

function getShortString(str: string) {
  return str.length < 24 ? str : str.substr(0, 20) + "...";
}

const clusters: Clusters = {
  [RelZone.Default]: null,
  [RelZone.Main]: null,
  [RelZone.IsControlled]: null,
  [RelZone.DoesControl]: null,
  [RelZone.IsDescendant]: null,
  [RelZone.IsRelated]: null,
  [RelZone.IsChild]: null,
  [RelZone.Ideology]: null,
  [RelZone.WorksFor]: null,
  [RelZone.GivesWork]: null,
  [RelZone.Other]: null,
  [RelZone.Opposition]: null,
  [RelZone.Participates]: null,
};
const clusterOrigins = {
  [RelZone.Default]: { x: 0, y: 0.5 },
  [RelZone.Main]: { x: 0.5, y: 0.5 },
  [RelZone.IsControlled]: { x: 0.5, y: 0 },
  [RelZone.DoesControl]: { x: 0.5, y: 1 },
  [RelZone.IsDescendant]: { x: 0, y: 0 },
  [RelZone.IsRelated]: { x: 1, y: 0.5 },
  [RelZone.IsChild]: { x: 0, y: 0 },
  [RelZone.Ideology]: { x: 0.2, y: 0.2 },
  [RelZone.WorksFor]: { x: 0.4, y: 1 },
  [RelZone.GivesWork]: { x: 0.4, y: 0 },
  [RelZone.Other]: { x: 0, y: 0.6 },
  [RelZone.Opposition]: { x: 0, y: 0.4 },
  [RelZone.Participates]: { x: 0.8, y: 0.25 },
};

class GraphD3Simple extends React.Component<Props> {
  private svgEl: React.RefObject<SVGSVGElement>;
  private gLinks: React.RefObject<SVGGElement>;
  private gNodes: React.RefObject<SVGGElement>;
  private simulation: d3.Simulation<V4NodeDatum, V4LinkDatum>;
  private nodesData: { [key: string]: V4NodeDatum } = {};
  private linksData: { [key: string]: V4LinkDatum } = {};

  constructor(props: Readonly<Props>) {
    super(props);
    this.svgEl = React.createRef();
    this.gLinks = React.createRef();
    this.gNodes = React.createRef();

    this.simulation = d3.forceSimulation();
    // .force("link", d3.forceLink().id(d => (d as V4NodeDatum).entityKey))
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
    const { width, height } = this.props;

    // Create a deep copy of the props and merges it to our existing data
    // We do this to preserve the positions and velocities from one
    // screen to the next.
    const { rEntitiesByKey, rRelationsByKey } = this.props;
    var rRelations: V4LinkDatum[] = [];
    for (let key in rRelationsByKey) {
      this.linksData[key] = this.linksData[key]
        ? Object.assign({}, this.linksData[key], rRelationsByKey[key])
        : Object.assign({}, rRelationsByKey[key]);
      rRelations.push(this.linksData[key]);
    }
    var rEntities: V4NodeDatum[] = [];
    for (let key in rEntitiesByKey) {
      this.nodesData[key] = this.nodesData[key]
        ? Object.assign({}, this.nodesData[key], rEntitiesByKey[key])
        : Object.assign({}, rEntitiesByKey[key]);
      const node = this.nodesData[key];
      const zone = node.sortedZones[0];
      if (typeof node.x !== "number")
        node.x = clusterOrigins[zone].x * height + Math.random() * 100 - 50;
      if (typeof node.y !== "number")
        node.y = clusterOrigins[zone].y * height + Math.random() * 100 - 50;
      if (!clusters[zone]) clusters[zone] = node;
      rEntities.push(node);
    }

    // D3 FORCES SETUP

    const maxProximity = d3.max(rRelations, d => d.proximity) || 1;
    const distScale = d3
      .scaleLinear()
      .domain([1, Math.max(maxProximity, 3)])
      .range([300, 80]);
    // We need to recreate the simulation for some reason... ?
    this.simulation = d3
      .forceSimulation<V4NodeDatum, V4LinkDatum>()
      .velocityDecay(0.82) // Akin to atmosphere friction (velocity multiplier)
      .alphaTarget(-0.01) // Stop mini-pixel-step-motion early
      // The most important force, attraction derived from our relations.
      .force(
        "link",
        d3
          .forceLink<V4NodeDatum, V4LinkDatum>()
          .id(d => {
            return d.entityKey;
          })
          .strength(0.1) // Warning: crashes if higher than 2, better stay within [0,1]
          // Make some links closer than others.
          .distance(d => distScale(d.proximity))
          // Emphasize this force and arrive faster at a stable result
          .iterations(4)
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
          .forceX<V4NodeDatum>(width / 2)
          .strength(d => (d.type === NodeRenderType.Primary ? 1 : 0))
      )
      .force(
        "y",
        d3
          .forceY<V4NodeDatum>(height / 2)
          .strength(d => (d.type === NodeRenderType.Primary ? 1 : 0))
      )
      // Pushes Tertiary entities towards an outer circle
      // .force(
      //   "radial",
      //   d3
      //     .forceRadial<V4NodeDatum>(
      //       Math.min(width, height) * 0.4,
      //       width / 2,
      //       height / 2
      //     )
      //     .strength(d => (d.type === NodeRenderType.Tertiary ? 1 : 0))
      // )
      // Alternative or helper to forceManyBody()
      .force(
        "collide",
        d3
          .forceCollide<V4NodeDatum>()
          .radius(collisionSize)
          .strength(0.2)
      )
      .force(
        "cluster",
        forceCluster() // see 'Accessing the module' above for the correct syntax
          .centers((d: V4NodeDatum) => {
            return clusters[d.sortedZones[0]];
          })
          .strength(0.5)
          .centerInertia(0.1)
      )
      // Keep all nodes within our canvas
      .force(
        "boundary",
        forceBoundary(0, 0, width, height).strength(0.4)
      ) as any;

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
      (d: V4LinkDatum | {}) => (d as V4LinkDatum).relationId
    );
    const lineStrokeWidth = 3;
    var links2 = links
      .enter()
      .append("g")
      .attr("class", "relation")
      .append("line")
      .classed("visual", true)
      .attr("stroke-width", lineStrokeWidth)
      .attr("stroke", relationColor)
      .select(goToParent)
      .append("circle")
      .attr("r", 4)
      .attr("fill", relationColor)
      // .attr("stroke-width", 0)
      // .attr("stroke", "#aaaaaa")
      .attr("opacity", d => (isDirectedType(d.sortedTypes[0]) ? 1 : 0))
      .select(goToParent)
      .append("line")
      .classed("interaction", true)
      .attr("stroke-width", 11)
      .attr("opacity", 0)
      .on("click", this.onRelationClick)
      .on("mouseover", function(d) {
        d3.select(this.parentNode as any)
          .select(".visual")
          .attr("stroke-width", Math.max(11, lineStrokeWidth));
        // .attr("stroke", "#000000");
      })
      .on("mouseout", function(d) {
        d3.select(this.parentNode as any)
          .select(".visual")
          .attr("stroke", relationColor as any)
          .attr("stroke-width", lineStrokeWidth);
      })
      .select(goToParent)
      .merge(links as any);
    var linksVisual = links2.select("line.visual").attr("opacity", linkOpacity);
    var linksInteraction = links2
      .select("line.interaction")
      .attr("stroke", "transparent");
    var linksC = links2.select("circle"); //.attr("opacity", linkOpacity);
    links.exit().remove();

    // NODES rendering
    var nodeGroup = d3.select(this.gNodes.current);
    var nodes = nodeGroup.selectAll("g.node").data(
      () => rEntities,
      // Key function to preserve the relation between DOM and rEntities
      (d: V4NodeDatum | {}) => (d as V4NodeDatum).entityKey
    );
    // Add nodes for the first time and define one-time attribute.
    var nodes2 = nodes
      .enter()
      .append("g")
      .classed("node", true)
      .classed("interaction", true)
      // .attr("transform", "scale(0.2, 0.2)")
      .on("click", this.onNodeClick)
      .on("mouseover", function(d) {
        d3.select(this)
          .select("text")
          .text(d.entity.name);
      })
      .on("mouseout", function(d) {
        // this.textContent = d.entity.name;
        d3.select(this)
          .select("text")
          .text(getShortString(d.entity.name));
      })
      // Add the text background
      // .append("rect")
      // .attr("opacity", 0.1)
      // .select(goToParent)
      // Add the text child
      .append("text")
      .text(d => getShortString(d.entity.name))
      .attr("text-anchor", "middle")
      .attr("dy", "14px")
      .attr("fill", d => (d.visited ? "#611E78" : theme.mainTextColor))
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

    /*
    // Get the text size and resize the background
    // Code from: http://bl.ocks.org/andreaskoller/7674031
    nodes2.select("text").each(function(d, _index) {
      // get bounding box of text field and store it in texts array
      d.bb = (this as SVGTextElement).getBBox();
    });
    var paddingLR = 4; // adjust the padding values depending on font and font size
    var paddingTB = 1;
    nodes2
      .select("rect")
      .attr("x", (d: any) => -d.bb.width / 2 - paddingLR / 2 + size(d) / 2)
      .attr("y", (d: any) => size(d) + 2 + paddingTB / 2)
      .attr("width", (d: any) => d.bb.width + paddingLR)
      .attr("height", (d: any) => d.bb.height + paddingTB)
      .attr("fill", "#ffffff");
    */

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
        .attr("x1", d => (d.source as V4NodeDatum).x as number)
        .attr("y1", d => (d.source as V4NodeDatum).y as number)
        .attr("x2", d => (d.target as V4NodeDatum).x as number)
        .attr("y2", d => (d.target as V4NodeDatum).y as number);
      linksInteraction
        .attr("x1", d => (d.source as V4NodeDatum).x as number)
        .attr("y1", d => (d.source as V4NodeDatum).y as number)
        .attr("x2", d => (d.target as V4NodeDatum).x as number)
        .attr("y2", d => (d.target as V4NodeDatum).y as number);

      linksC
        .attr("cx", (d: any) =>
          between(
            (d.source as V4NodeDatum).x,
            (d.target as V4NodeDatum).x,
            0.15
          )
        )
        .attr("cy", (d: any) =>
          between(
            (d.source as V4NodeDatum).y,
            (d.target as V4NodeDatum).y,
            0.15
          )
        );
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
      V4NodeDatum,
      V4LinkDatum
    >;
    linkForce.links(rRelations);

    // this.simulation.restart();
  }

  onNodeClick = (d: V4NodeDatum, _index: number) => {
    this.props.history.push(`/${ROUTES.entity}/${d.entityKey}`);
  };

  onRelationClick = (d: V4LinkDatum, _index: number) => {
    this.props.history.push(
      `/${ROUTES.relation}/${d.sourceKey}/${d.targetKey}`
    );
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
