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
import BaseImportEntity from "./BaseImportEntity";

type Props = {
  dsEntities: Dictionary<Entity>;
  similarEntities: SimilarEntities;
  similarEntitiesSelection: SimilarEntitiesSelection;
};

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin: ${props => props.theme.marginTB} 0;
  padding-bottom: ${props => props.theme.marginTB};
  border-bottom: solid 1px ${props => props.theme.lightBG};
  ${media.tablet`display: block;`}
`;

const BaseColumn = styled.div`
  flex-grow: 1;
  flex-basis: 0;

  // Gutter
  margin-right: ${props => props.theme.marginLR};

  & > * {
    max-width: 100%;
  }
`;
const OptionsColumn = styled.div`
  flex-grow: 3;
  flex-basis: 0;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Label = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 300px;
  margin-right: 20px;
  margin-top: ${props => props.theme.marginTB};
  margin-bottom: ${props => props.theme.marginTB};
  cursor: pointer;

  & > input {
    margin: ${props => props.theme.inputPaddingTB}
      ${props => props.theme.inputPaddingLR};
  }
`;

const SimilarEntitiesSelector: FunctionComponent<Props> = props => {
  const onSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = parseInt(event.target.value);
    console.log("Selected " + selected + " of " + event.target.name);
  };

  return (
    <div>
      <p>
        These entities look like they could exist in our database. Please review
        which ones should be merged. If you don't select a corresponding entity,
        a new one will be created
      </p>
      <Row>
        <BaseColumn>
          <h5>Entity to import</h5>
        </BaseColumn>
        <OptionsColumn>
          <h5>Similar entities already in our database</h5>
        </OptionsColumn>
      </Row>
      {Object.keys(props.similarEntities).map((key, index) => (
        <Row key={key}>
          <BaseColumn>
            <BaseImportEntity entity={props.dsEntities[key]} />
          </BaseColumn>
          <OptionsColumn>
            <Label>
              <input
                type="radio"
                name={key}
                value={-1}
                onChange={onSelect}
                checked={(props.similarEntitiesSelection[key] || -1) === -1}
              />
              Create new
            </Label>

            {props.similarEntities[key].map((entity, index) => (
              <Label key={index}>
                <input
                  type="radio"
                  name={key}
                  value={index}
                  onChange={onSelect}
                  checked={props.similarEntitiesSelection[key] === index}
                />
                <BaseImportEntity key={index} entity={entity} />
              </Label>
            ))}
          </OptionsColumn>
        </Row>
      ))}
    </div>
  );
};

export default SimilarEntitiesSelector;
