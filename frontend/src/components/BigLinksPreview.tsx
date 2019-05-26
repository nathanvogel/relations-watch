import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Edge } from "../utils/types";
import { LegendRelationTypeMapping } from "../strings/strings";
import { RELATION_COLORS } from "../styles/theme";

const Header = styled.header`
  // min-height: 200px;
  padding-top: 6px;
`;

const EdgesWrapper = styled.div`
  width: 110%;
  position: relative;
  left: -5%;
  z-index: -10;
`;

const VisualEdge = styled.div`
  height: 0.3em;
  // border-radius: 2.5px;
  background-color: ${props => props.color}
  margin-bottom: 0.3em;
`;

const EdgeTypeExplainer = styled.span`
  padding: 2px;
  padding-left: 4px;
  padding-right: 4px;
  margin: 3px;
  border-radius: 2px;
  font-size: ${props => props.theme.fontSizeS};
  font-weight: bold;
  color: white;
  background-color: ${props => props.color};
`;

const ExplainersWrapper = styled.div`
  margin: 0px ${props => props.theme.marginLR};
  text-align: center;
  font-size: ${props => props.theme.fontSizeS};
`;

type OwnProps = {
  relations: Edge[];
};

/**
 * Should render something even if props.relations is empty.
 * To keep height consistent and show the loading state below.
 * @extends React
 */
const BigLinksPreview: React.FunctionComponent<OwnProps> = props => {
  const { relations } = props;
  const { t } = useTranslation();

  // Find unique types
  const types = [];
  for (let i = 0; i < relations.length; i++) {
    const link = relations[i];
    if (types.indexOf(link.type) < 0) types.push(link.type);
  }
  types.sort((a, b) => a - b);

  return (
    <Header>
      <EdgesWrapper>
        {types.map((type, index) => (
          <VisualEdge key={type} color={RELATION_COLORS[type]} />
        ))}
      </EdgesWrapper>
      <ExplainersWrapper>
        {types.map((type, index) => (
          <EdgeTypeExplainer key={type} color={RELATION_COLORS[type]}>
            {t(LegendRelationTypeMapping[type])}
          </EdgeTypeExplainer>
        ))}
      </ExplainersWrapper>
    </Header>
  );
};

export default BigLinksPreview;
