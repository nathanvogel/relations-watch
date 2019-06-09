import React, { FunctionComponent } from "react";
import { Entity, EntityPreview } from "../../utils/types";
import styled from "styled-components";
import { getEntitySAsset } from "../../assets/EntityIcons";
import EntityImage from "./EntityImage";
import EntityDescription from "./EntityDescription";
import EntityName from "./EntityName";
import EntityViewContainer from "./EntityViewContainer";

type Props = {
  entity: Entity | EntityPreview;
};

const Container = styled(EntityViewContainer)`
  padding: ${props => props.theme.inputPaddingTB}
    ${props => props.theme.inputPaddingLR};
  font-size: ${props => props.theme.fontSizeS};
  background-color: ${props => props.theme.inputBG};
  border-radius: ${props => props.theme.radius};
  text-align: left;
`;

const EntityView: FunctionComponent<Props> = props => {
  const { entity } = props;

  return (
    <Container>
      <EntityImage src={getEntitySAsset(entity.type)} />
      <div>
        <EntityName>{entity.name}</EntityName>
        {entity.text && <EntityDescription>{entity.text}</EntityDescription>}
      </div>
    </Container>
  );
};

export default EntityView;
