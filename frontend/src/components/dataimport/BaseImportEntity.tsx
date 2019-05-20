import React, { FunctionComponent } from "react";
import { Entity } from "../../utils/types";
import styled from "styled-components";
import { getEntityLAsset } from "../../assets/EntityIcons";

type Props = {
  entity: Entity;
};

const Container = styled.div`
  padding: ${props => props.theme.inputPaddingTB}
    ${props => props.theme.inputPaddingLR};
  font-size: ${props => props.theme.fontSizeS};
  background-color: ${props => props.theme.inputBG};
  border-radius: ${props => props.theme.radius};
  display: flex;
  flex-direction: row;
  align-items: start;
  // max-width: 250px;

  & > div {
    max-width: 100%;

    > * {
      max-width: 100%;
    }
  }
`;

const TextColumn = styled.div`
  overflow: hidden;
`;
const PersonName = styled.div`
  font-weight: bold;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  // overflow: hidden;
`;
const PersonDescription = styled.div`
  // white-space: nowrap;
  // text-overflow: ellipsis;
  // overflow: hidden;
`;

const Image = styled.img`
  display: block;
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  margin-right: ${props => props.theme.marginLR};
`;

const BaseImportEntity: FunctionComponent<Props> = props => {
  const { entity } = props;

  return (
    <Container>
      <Image src={getEntityLAsset(entity.type)} />
      <TextColumn>
        <PersonName>{entity.name}</PersonName>
        <PersonDescription>{entity.text}</PersonDescription>
      </TextColumn>
    </Container>
  );
};

export default BaseImportEntity;
