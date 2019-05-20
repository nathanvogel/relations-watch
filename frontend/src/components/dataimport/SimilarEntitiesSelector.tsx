import React, { FunctionComponent } from "react";
import {
  SimilarEntities,
  SimilarEntitiesSelection,
  Entity,
  Dictionary
} from "../../utils/types";
import styled from "styled-components";
import ImportEntityPreview from "./ImportEntityPreview";
import { media } from "../../styles/media-styles";

type Props = {
  dsEntities: Dictionary<Entity>;
  similarEntities: SimilarEntities;
  similarEntitiesSelection: SimilarEntitiesSelection;
};

const Row = styled.div`
  display: flex;
  ${media.mobile`display: block;`}
`;

const BaseColumn = styled.div`
  flex-grow: 1;
`;
const OptionsColumn = styled.div`
  flex-grow: 3;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const SimilarEntitiesSelector: FunctionComponent<Props> = props => {
  return (
    <div>
      {Object.keys(props.similarEntities).map((key, index) => (
        <Row key={key}>
          <BaseColumn>
            <ImportEntityPreview entity={props.dsEntities[key]} />
          </BaseColumn>
          <OptionsColumn>
            {props.similarEntities[key].map((entity, index) => (
              <ImportEntityPreview key={index} entity={entity} />
            ))}
          </OptionsColumn>
        </Row>
      ))}
    </div>
  );
};

export default SimilarEntitiesSelector;
