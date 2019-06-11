import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { edgeTextResKey } from "../strings/strings";
import { edgeColor } from "../styles/theme";
import { getInbetweenEdges } from "../features/linksSelector2";
import { connect } from "react-redux";
import { isDirectedType } from "../utils/utils";
import { RootStore } from "../Store";

const EdgeTypeExplainer = styled.div`
  padding: 1px 4px;
  border-radius: 0px;
  font-size: ${props => props.theme.fontSizeS};
  font-weight: bold;
  color: ${props => props.theme.lightTextColor};
  background-color: ${props => props.color};
  width: 100%;
  max-width: 100%;
  height: auto;
`;

const ExplainersWrapper = styled.div`
  margin: 4px 0px;
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

/**
 * Should render something even if props.edges is empty.
 * To keep height consistent and show the loading state below.
 * @extends React
 */
const BigLinksPreview: React.FunctionComponent<Props> = props => {
  const { edges, sourceKey, targetKey } = props;
  const { t } = useTranslation();

  // Find unique types
  // const types = [];
  // for (let i = 0; i < edges.length; i++) {
  //   const link = edges[i];
  //   if (types.indexOf(link.type) < 0) types.push(link.type);
  // }
  // types.sort((a, b) => a - b);

  // TODO : de-dup. Better presentation. Responsive

  return (
    <ExplainersWrapper className={props.className}>
      {Object.keys(edges).map(key => {
        const edge = edges[key];
        const directed = isDirectedType(edge.type, edge.fType);
        return (
          <EdgeTypeExplainer key={key} color={edgeColor(edge.type, edge.fType)}>
            {directed && edge._from === sourceKey && "⬅ "}
            {t(edgeTextResKey(edge.type, edge.fType))}
            {directed && edge._to === sourceKey && " ➡"}
          </EdgeTypeExplainer>
        );
      })}
    </ExplainersWrapper>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BigLinksPreview);
