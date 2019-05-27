import React, { FunctionComponent } from "react";
import { Entity } from "../../utils/types";
import styled from "styled-components";
import { getEntitySAsset } from "../../assets/EntityIcons";
import EntityImage from "./EntityImage";
import EntityDescription from "./EntityDescription";
import EntityName from "./EntityName";
import EntityPreviewContainer from "./EntityPreviewContainer";

type Props = {
  entity: Entity;
};

const Container = styled(EntityPreviewContainer)`
  padding: ${props => props.theme.inputPaddingTB}
    ${props => props.theme.inputPaddingLR};
  font-size: ${props => props.theme.fontSizeS};
  background-color: ${props => props.theme.inputBG};
  border-radius: ${props => props.theme.radius};
`;

const EntityPreview: FunctionComponent<Props> = props => {
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

export default EntityPreview;