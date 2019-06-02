import React from "react";
import styled from "styled-components";
import { EntityType, RelationTypeValues } from "../../utils/types";
import { getEntitySAsset } from "../../assets/EntityIcons";
import { RELATION_COLORS } from "../../styles/theme";
import { LegendRelationTypeMapping } from "../../strings/strings";
import { useTranslation } from "react-i18next";
import R from "../../strings/R";

const EdgeLegend = styled.div`
  & {
    font-weight: normal;
    font-size: ${props => props.theme.fontSizeS};
    width: fit-content;
    position: relative;
    z-index: 1;
    transition: all 0.1s ease-in-out;
    margin-bottom: 4px;
    line-height: 1.6;
  }

  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    top: calc(100% - 4px);
    bottom: 1px;
    left: -0em;
    right: -0em;
    background-color: ${props => props.color};
    transform-origin: bottom center;
    // transform: scaleY(0.3);
    transition: all 0.1s ease-in-out;
    opacity: 1;
  }

  &:hover::before {
    // transform: scaleY(1);
  }

  &:hover {
    // color: white;
  }
`;

const EntityTypeLegendContainer = styled.div`
  font-weight: normal;
  font-size: ${props => props.theme.fontSizeS};
  margin-bottom: 4px;

  & > img {
    width: 12px;
    height: 12px;
    margin-right: 4px;
    translate: 0 2px;
  }
`;

type EntityTypeProps = {
  string: string;
  type: EntityType;
};

const EntityTypeLegend: React.FunctionComponent<EntityTypeProps> = props => (
  <EntityTypeLegendContainer>
    <img src={getEntitySAsset(props.type)} />
    {props.string}
  </EntityTypeLegendContainer>
);

const SidebarSpacing = styled.div`
  height: 20px;
  width: 0px;
`;

const GraphLegend: React.FunctionComponent = _ => {
  const { t } = useTranslation();

  return (
    <div>
      {RelationTypeValues.map((type, index) => (
        <EdgeLegend key={type} color={RELATION_COLORS[type]}>
          {t(LegendRelationTypeMapping[type])}
        </EdgeLegend>
      ))}
      <SidebarSpacing />
      <EntityTypeLegend string={t(R.legend_human)} type={EntityType.Human} />
      <EntityTypeLegend
        string={t(R.legend_moral_person)}
        type={EntityType.MoralPerson}
      />
      <EntityTypeLegend string={t(R.legend_state)} type={EntityType.State} />
      <EntityTypeLegend string={t(R.legend_media)} type={EntityType.Media} />
      <EntityTypeLegend string={t(R.legend_group)} type={EntityType.Group} />
      <EntityTypeLegend string={t(R.legend_event)} type={EntityType.Event} />
    </div>
  );
};

export default GraphLegend;
