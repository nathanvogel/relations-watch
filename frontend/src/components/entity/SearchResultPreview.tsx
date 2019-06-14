import React, { FunctionComponent } from "react";
import { EntitySelectOption } from "../../utils/types";
import styled from "styled-components";
import { getEntitySAsset } from "../../assets/EntityIcons";
import EntityImage from "./EntityImage";
import EntityDescription from "./EntityDescription";
import EntityName from "./EntityName";
import EntityViewContainer from "./EntityViewContainer";
import { getDatasetSAsset } from "../../assets/dataset/DatasetIcons";

type Props = {
  entity: EntitySelectOption;
};

const Container = styled(EntityViewContainer)`
  background-color: ${props => props.theme.appBG};
`;

const SearchResultPreview: FunctionComponent<Props> = props => {
  const { entity } = props;

  return (
    <Container>
      <EntityImage
        src={
          entity.type
            ? getEntitySAsset(entity.type)
            : entity.dataset
            ? getDatasetSAsset(entity.dataset)
            : ""
        }
      />
      <div>
        <EntityName>{entity.label}</EntityName>
        {entity.text && <EntityDescription>{entity.text}</EntityDescription>}
      </div>
    </Container>
  );
};

export default SearchResultPreview;
