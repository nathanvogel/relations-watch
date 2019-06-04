import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import * as d3 from "d3";
import "d3-force";
//@ts-ignore
import { forceCluster } from "d3-force-cluster";
//@ts-ignore
import { bboxCollide } from "d3-bboxCollide";
import forceBoundary from "../utils/d3/d3-force-boundary";
import {
  V4LinkDatum,
  V4NodeDatum,
  NodeRenderType,
  RelationType,
  RelZone,
  Clusters,
  LinkDir,
  V4IndicatorDatum,
  RelationTypeValues,
  V4LinkPosDatum,
  FamilialLink,
} from "../utils/types";
import ROUTES from "../utils/ROUTES";
import { getEntitySAsset } from "../assets/EntityIcons";
import theme, { RELATION_COLORS } from "../styles/theme";
import "./GraphV4.css";
import { createIndicatorDatum } from "../utils/utils";

const SVG = styled.svg`
  display: block;
`;

// ===== NODE APPEARANCE

function size(d: V4NodeDatum): number {
  return 14;
  // return sizeT(d.type);
}
function sizeT(type: NodeRenderType): number {
  // switch (type) {
  //   case NodeRenderType.Primary:
  //     return 14;
  //   case NodeRenderType.Secondary:
  //     return 14;
  //   case NodeRenderType.Tertiary:
  //     return 14;
  // }
  return 14;
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
      return "500";
    case NodeRenderType.Tertiary:
      return "500";
  }
}

function fontSize(d: V4NodeDatum): number {
  switch (d.type) {
    case NodeRenderType.Primary:
      return 14;
    case NodeRenderType.Secondary:
      return 14;
    case NodeRenderType.Tertiary:
      return 12;
  }
}

function nodeImage(d: V4NodeDatum): string {
  return getEntitySAsset(d.entity.type);
}

// ===== TEXT HELPERS

function getShortString(str: string) {
  return str.length < 24 ? str : str.substr(0, 20) + "...";
}

// ===== NODE PHYISCS

const nodeSize = 40;
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

// ==== LINK APPEARANCE

function linkColor(d: V4LinkDatum) {
  if (
    d.sortedTypes[0] === RelationType.Family &&
    d.fTypes.length > 0 &&
    d.fTypes[0] === FamilialLink.spouseOf
  )
    return RELATION_COLORS[RelationType.Love];
  return RELATION_COLORS[d.sortedTypes[0]];
}

function linkOpacity(d: V4LinkDatum) {
  const o = (Math.min(d.proximity, 3) / 3) * 0.4 + 0.6;
  return o;
  // return d.withType === NodeRenderType.Primary ? 1 : 0.5;
}

function linkStrokeWidth(d: V4LinkDatum) {
  return Math.min(Math.max(d.proximity, 1), 4);
  // return 1;
}

// ===== POSITION CALC

/**
 * Mutate the given position to the starting and ending points of the
 * relation.
 */
function computeLinkPosition(p: V4LinkPosDatum, rel: V4LinkDatum) {
  const e1 = rel.source as V4NodeDatum;
  const e2 = rel.target as V4NodeDatum;
  // if (isNaN(e1.x) || isNaN(e2.x)) {
  //   console.error("e1 NaN", e1);
  //   e1.x = 200;
  //   e1.y = 200;
  //   e2.x = 400;
  //   e2.y = 400;
  //   return;
  // }
  const dist1 = size(e1) / 2 - 2;
  const dist2 = size(e2) / 2 - 2;
  p.x1 = e1.x;
  p.y1 = e1.y - 5;
  p.x2 = e2.x;
  p.y2 = e2.y - 5;
  p.angle = Math.atan2(p.y2 - p.y1, p.x2 - p.x1);
  p.x1 += Math.cos(p.angle) * dist1;
  p.y1 += Math.sin(p.angle) * dist1;
  p.x2 -= Math.cos(p.angle) * dist2;
  p.y2 -= Math.sin(p.angle) * dist2;
}

const indicatorDist = 9;
const indicatorOffset = 5;

/**
 * Compute the indicator x position
 */
function getIndicatorX(d: V4IndicatorDatum, p: V4LinkPosDatum) {
  const invert = d.direction === LinkDir.Invert;
  const xDiff =
    Math.cos(p.angle) * (indicatorDist + indicatorOffset * d.offsetIndex);
  return invert ? p.x1 + xDiff : p.x2 - xDiff;
}

/**
 * Compute the indicator y position
 */
function getIndicatorY(d: V4IndicatorDatum, p: V4LinkPosDatum) {
  const invert = d.direction === LinkDir.Invert;
  const yDiff =
    Math.sin(p.angle) * (indicatorDist + indicatorOffset * d.offsetIndex);
  return invert ? p.y1 + yDiff : p.y2 - yDiff;
}

// ===== CLUSTER DATA

/**
 * Store the NodeDatum which is the leader of the cluster (and thus contain
 * the xy position to follow for the other)
 * @type {[type]}
 */
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
  [RelZone.WorksFor]: { x: 0.4, y: 0 },
  [RelZone.GivesWork]: { x: 0.4, y: 1 },
  [RelZone.Other]: { x: 0, y: 0.6 },
  [RelZone.Opposition]: { x: 0, y: 0.4 },
  [RelZone.Participates]: { x: 0.9, y: 0.2 },
};

// ===== D3 SELECTION HELPER

function goToParent(this: Element | null) {
  if (!this) return null;
  return this.parentNode as any;
}

type Props = {
  rRelations: V4LinkDatum[];
  rEntities: V4NodeDatum[];
  rRelationsByKey: { [relationId: string]: V4LinkDatum };
  rEntitiesByKey: { [entityKey: string]: V4NodeDatum };
  width: number;
  height: number;
  network: boolean;
} & RouteComponentProps;

/**
 * Draws an SVG graph of the given size for the given relations and nodes.
 */
class GraphV4 extends React.Component<Props> {
  private svgEl: React.RefObject<SVGSVGElement>;
  private gLinks: React.RefObject<SVGGElement>;
  private gNodes: React.RefObject<SVGGElement>;
  private gIndicators: React.RefObject<SVGGElement>;
  private simulation: d3.Simulation<V4NodeDatum, V4LinkDatum>;
  private nodesData: { [entityKey: string]: V4NodeDatum } = {};
  private linksData: { [relationId: string]: V4LinkDatum } = {};
  // private dotsData: { [key: string]: V4IndicatorDatum } = {};

  constructor(props: Readonly<Props>) {
    super(props);
    this.svgEl = React.createRef();
    this.gLinks = React.createRef();
    this.gNodes = React.createRef();
    this.gIndicators = React.createRef();

    this.simulation = d3.forceSimulation();
  }

  componentDidMount() {
    this.updateGraph();
  }

  componentDidUpdate() {
    this.updateGraph();
  }

  updateGraph() {
    const { network } = this.props;

    // D3 RELATIONS DATA
    const { rEntitiesByKey, rRelationsByKey } = this.props;
    var rRelations: V4LinkDatum[] = [];
    var linkPositions: { [relationId: string]: V4LinkPosDatum } = {};
    for (let relationId in rRelationsByKey) {
      // Perform a shallow copy to modify position data, etc. afterwards.
      this.linksData[relationId] = Object.assign(
        this.linksData[relationId] || {},
        rRelationsByKey[relationId]
      );
      linkPositions[relationId] = { x1: 0, y1: 0, x2: 0, y2: 0, angle: 0 };
      rRelations.push(this.linksData[relationId]);
    }

    // D3 INDICATORS DATA
    var rIndicators: V4IndicatorDatum[] = [];
    for (let key in rRelationsByKey) {
      const rRelation = rRelationsByKey[key];
      let normalCount = 0;
      let invertCount = 0;
      for (let relationType of RelationTypeValues) {
        const dir = rRelation.tDirections[relationType];
        if (dir === LinkDir.Normal || dir === LinkDir.Both) {
          rIndicators.push(
            createIndicatorDatum(
              rRelation,
              relationType,
              LinkDir.Normal,
              normalCount
            )
          );
          normalCount += 1;
        }
        if (dir === LinkDir.Invert || dir === LinkDir.Both) {
          rIndicators.push(
            createIndicatorDatum(
              rRelation,
              relationType,
              LinkDir.Invert,
              invertCount
            )
          );
          invertCount += 1;
        }
      }
    }
    // Render the dot closer to the nodes on top.
    rIndicators.reverse();

    // D3 NODES DATA
    // Create a deep copy of the props and merges it to our existing data
    // We do this to preserve the positions and velocities from one
    // screen to the next.
    var rEntities: V4NodeDatum[] = [];
    for (let key in rEntitiesByKey) {
      this.nodesData[key] = this.nodesData[key]
        ? Object.assign({}, this.nodesData[key], rEntitiesByKey[key])
        : Object.assign({}, rEntitiesByKey[key]);
      rEntities.push(this.nodesData[key]);
    }

    const nodeCount = rEntities.length;
    const bigGraph = nodeCount > 70;
    const width = bigGraph ? this.props.width : this.props.width;
    const height = bigGraph ? this.props.height : this.props.height;

    // INITIAL node positions + clustering;
    // TODO : calculate relative to origin
    for (let node of rEntities) {
      const zone = node.sortedZones[0];
      if (typeof node.x !== "number")
        node.x = clusterOrigins[zone].x * width + Math.random() * 100 - 50;
      if (typeof node.y !== "number")
        node.y = clusterOrigins[zone].y * height + Math.random() * 100 - 50;
      if (!clusters[zone]) clusters[zone] = node;
    }

    // D3 FORCES SETUP
    const maxProximity = d3.max(rRelations, d => d.proximity) || 1;
    console.log("SETUP", nodeCount);
    const distScale = d3
      .scaleLinear()
      .domain([1, Math.max(maxProximity, 4)])
      .range([80, 50]);
    const connectednessFactor = d3
      .scaleLinear()
      .domain([0, 7])
      .range([0.3, 1]);
    // We need to recreate the simulation for some reason... ?
    this.simulation = d3
      .forceSimulation<V4NodeDatum, V4LinkDatum>()
      .velocityDecay(network ? 0.5 : 0.9) // Akin to atmosphere friction (velocity multiplier)
      .alphaTarget(-0.03) // Stop mini-pixel-step-motion early
      // The most important force, attraction derived from our relations.
      .force(
        "link",
        d3
          .forceLink<V4NodeDatum, V4LinkDatum>()
          .id(d => {
            return d.entityKey;
          })
          .strength(bigGraph ? 0.8 : network ? 0.4 : 0.4) // Warning: crashes if higher than 2, better stay within [0,1]
          // Make some links closer than others.
          .distance(
            d =>
              distScale(d.proximity) *
              connectednessFactor(
                (d.source as V4NodeDatum).connectedEntities.size
              ) *
              connectednessFactor(
                (d.target as V4NodeDatum).connectedEntities.size
              )
          )
          // Emphasize this force and arrive faster at a stable result
          .iterations(bigGraph ? 3 : network ? 1 : 4)
      )
      // Makes nodes repulse each other
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(bigGraph ? -4000 : network ? -8000 : -8000)
          .distanceMax(450)
      )
      // Keep the whole graph centered
      .force("center", d3.forceCenter(width / 2, height / 2))
      // Put the primary entity at the center of the graph
      // .force(
      //   "x",
      //   d3
      //     .forceX<V4NodeDatum>(width / 2)
      //     .strength(d => (d.type === NodeRenderType.Primary ? 1 : 0))
      // )
      // .force(
      //   "y",
      //   d3
      //     .forceY<V4NodeDatum>(height / 2)
      //     .strength(d => (d.type === NodeRenderType.Primary ? 1 : 0))
      // )
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
      // .force(
      //   "collide",
      //   d3
      //     .forceCollide<V4NodeDatum>()
      //     .radius(20)
      //     .strength(0.4)
      // )
      .force(
        "collideR",
        bboxCollide(bigGraph ? [[-10, -20], [80, 20]] : [[-10, -12], [140, 12]])
          .strength(bigGraph ? 0.6 : 1)
          .iterations(1)
      )
      // Keep all nodes within our canvas
      .force(
        "boundary",
        forceBoundary(bigGraph ? 0 : 180, 40, width - 180, height - 0).strength(
          1.4
        )
      );
    if (!network) {
      this.simulation.force(
        "cluster",
        forceCluster() // see 'Accessing the module' above for the correct syntax
          .centers((d: V4NodeDatum) => {
            return clusters[d.sortedZones[0]];
          })
          .strength(0.9)
          .centerInertia(0.1)
      );
    }

    // D3 RENDERING starts here

    // LINKS rendering
    var linkGroup = d3.select(this.gLinks.current);
    var links = linkGroup.selectAll("g").data(
      rRelations,
      // Key function to preserve the relation between DOM and rRelations
      (d: V4LinkDatum | {}) => (d as V4LinkDatum).relationId
    );
    var allLinks = links
      .enter()
      .append("g")
      .attr("class", "relation")
      .append("line")
      .classed("visual", true)
      .attr("stroke-width", linkStrokeWidth)
      .attr("stroke", linkColor)
      .select(goToParent)
      .append("line")
      .classed("interaction", true)
      .attr("stroke-width", 11)
      .attr("opacity", 0)
      .on("click", this.onRelationClick)
      .on("mouseover", function(d) {
        d3.select(this.parentNode as any)
          .select(".visual")
          .attr("stroke-width", Math.max(11, linkStrokeWidth(d)));
        // .attr("stroke", "#000000");
      })
      .on("mouseout", function(d) {
        d3.select(this.parentNode as any)
          .select(".visual")
          .attr("stroke", linkColor(d))
          .attr("stroke-width", linkStrokeWidth(d));
      })
      .select(goToParent)
      .merge(links as any);
    // Attributes that should be update at every prop change
    var linksVisual = allLinks
      .select("line.visual")
      .attr("opacity", linkOpacity);
    var linksInteraction = allLinks
      .select("line.interaction")
      .attr("stroke", "transparent");
    // Remove old links
    links.exit().remove();

    // INDICATORS rendering
    var indicatorGroup = d3.select(this.gIndicators.current);
    var indicators = indicatorGroup
      .selectAll("circle.indicator")
      .data(
        rIndicators,
        (d: V4IndicatorDatum | {}) => (d as V4IndicatorDatum).indicatorId
      );
    const allIndicators = indicators
      .enter()
      .append("circle")
      .classed("indicator", true)
      .attr("r", 5)
      .attr("fill", d => RELATION_COLORS[d.type])
      .attr("opacity", d => linkOpacity(this.linksData[d.relationId]))
      .merge(indicators as any);
    indicators.exit().remove();

    // NODES rendering
    var nodeGroup = d3.select(this.gNodes.current);
    var nodes = nodeGroup.selectAll("g.node").data(
      rEntities,
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
      // Add the image child
      .append("image")
      .attr("href", nodeImage)
      .select(goToParent)
      // Add the text child
      .append("text")
      .text(d => getShortString(d.entity.name))
      .attr("dy", 12)
      .attr("fill", d => (d.visited ? "#611E78" : theme.mainTextColor))
      .select(goToParent)
      .merge(nodes as any);
    // Update dynamic attributes for all nodes:
    var labels = nodes2
      .select("text")
      .attr("font-size", 14)
      .attr("font-weight", fontWeight);
    // .attr("transform", d => `translate(${size(d) / 2},${size(d)})`);
    nodes2
      .select("image")
      // .attr("y", 0)
      // .attr("x", 0)
      .attr("width", 14)
      .attr("height", 14);

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
      // .transition()
      // .duration(300)
      // .attr("opacity", 0)
      // .attr("transform", d => nodeTranslate(d as any) + " scale(0,0)")
      .remove();

    const isLabelOnTheLeft = (d: V4NodeDatum) => !bigGraph && d.x < width / 2;

    // Update the positions from the simulation
    this.simulation.on("tick", () => {
      // First compute the starting and ending positions of the links, as
      // they'll be reused multiple times.
      for (let rRelation of rRelations) {
        computeLinkPosition(linkPositions[rRelation.relationId], rRelation);
      }

      linksVisual
        .attr("x1", d => linkPositions[d.relationId].x1)
        .attr("y1", d => linkPositions[d.relationId].y1)
        .attr("x2", d => linkPositions[d.relationId].x2)
        .attr("y2", d => linkPositions[d.relationId].y2);
      linksInteraction
        .attr("x1", d => linkPositions[d.relationId].x1)
        .attr("y1", d => linkPositions[d.relationId].y1)
        .attr("x2", d => linkPositions[d.relationId].x2)
        .attr("y2", d => linkPositions[d.relationId].y2);

      allIndicators
        .attr("cx", d => getIndicatorX(d, linkPositions[d.relationId]))
        .attr("cy", d => getIndicatorY(d, linkPositions[d.relationId]));

      nodes2.attr("transform", nodeTranslate);
      labels
        .attr("text-anchor", d => (isLabelOnTheLeft(d) ? "end" : "start"))
        .attr("dx", d => (isLabelOnTheLeft(d) ? -1 : 16));
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
    const { width, height } = this.props;
    return (
      <SVG
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        ref={this.svgEl}
      >
        <g className="links" ref={this.gLinks} />
        <g className="indicators" ref={this.gIndicators} />
        <g className="nodes" ref={this.gNodes} />
      </SVG>
    );
  }
}

// export default withRouter(withContentRect("bounds")<Props>(GraphV4));
export default withRouter(GraphV4);
