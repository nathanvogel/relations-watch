import React from "react";
import styled from "styled-components";
import { edgeTextResKey } from "../strings/strings";
import { edgeColor } from "../styles/theme";
import { getInbetweenEdges } from "../features/linksSelector2";
import { connect } from "react-redux";
import { isDirectedType } from "../utils/utils";
import { RootStore } from "../Store";
import { LinkDir, EdgePreview, RelationType } from "../utils/types";
import i18n from "../i18n/i18n";

const EdgeTypeExplainer = styled.div`
  padding: 1px 4px;
  box-sizing: border-box;
  border-radius: 0px;
  font-size: ${props => props.theme.fontSizeS};
  font-weight: bold;
  color: ${props => props.theme.lightTextColor};
  background-color: ${props => props.color};
  width: 100%;
  max-width: 100%;
  height: auto;
  // To position:absolute the children
  position: relative;

  & > span.left {
    position: absolute;
    left: 8px;
    top: 2px;
  }

  & > span.right {
    position: absolute;
    right: 8px;
    top: 2px;
  }
`;

const ExplainersWrapper = styled.div`
  margin: 4px 0px;
  box-sizing: border-box;
  text-align: center;
  font-size: ${props => props.theme.fontSizeS};
`;

type OwnProps = {
  sourceKey: string;
  targetKey: string;
  className?: string;
};

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  return {
    ...props,
    edges: getInbetweenEdges(state, props),
  };
};
const mapDispatchToProps = () => ({});
type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type RTypeSummary = {
  direction: LinkDir.None | LinkDir.Normal | LinkDir.Invert;
  color: string;
  text: string; // will factor past/owned/etc.
  type: RelationType; // for sorting
  key: string; // for React
};

const getSummary = (edge: EdgePreview, sourceKey: string): RTypeSummary => {
  // WARNING: unpure 't' injection, but who cares?
  const directed = isDirectedType(edge.type, edge.fType);
  return {
    text: i18n.t(edgeTextResKey(edge.type, edge.fType)),
    color: edgeColor(edge.type, edge.fType),
    direction: directed
      ? edge._from === sourceKey
        ? LinkDir.Invert
        : LinkDir.Normal
      : LinkDir.None,
    type: edge.type,
    key: edge._key,
  };
};

const areSummariesEquivalent = (
  s1: RTypeSummary,
  s2: RTypeSummary
): boolean => {
  return (
    s1.direction === s2.direction &&
    s1.color === s2.color &&
    s1.text === s2.text
  );
};

const containsEquivalent = (
  summaries: RTypeSummary[],
  summary: RTypeSummary
): boolean => {
  for (let s of summaries) if (areSummariesEquivalent(s, summary)) return true;
  return false;
};

/**
 * Should render something even if props.edges is empty.
 * To keep height consistent and show the loading state below.
 * @extends React
 */
const BigLinksPreview: React.FunctionComponent<Props> = props => {
  const { edges, sourceKey } = props;

  const summaries: RTypeSummary[] = [];
  for (let edgeKey in edges) {
    const summary = getSummary(edges[edgeKey], sourceKey);
    if (!containsEquivalent(summaries, summary)) summaries.push(summary);
  }
  summaries.sort((a, b) => a.type - b.type);

  return (
    <ExplainersWrapper className={props.className}>
      {summaries.map(s => (
        <EdgeTypeExplainer key={s.key} color={s.color}>
          {s.direction === LinkDir.Invert && <span className="left">⬅ </span>}
          {s.text}
          {s.direction === LinkDir.Normal && <span className="right"> ➡</span>}
        </EdgeTypeExplainer>
      ))}
    </ExplainersWrapper>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BigLinksPreview);
