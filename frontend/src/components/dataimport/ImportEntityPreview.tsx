import React, { FunctionComponent } from "react";
import { Entity } from "../../utils/types";
import styled from "styled-components";

type Props = {
  entity: Entity;
};

const Container = styled.span`
  padding: ${props => props.theme.inputPaddingTB}
    ${props => props.theme.inputPaddingTB};
  margin: ${props => props.theme.inputMarginTB} ${props => props.theme.marginLR};
  font-size: ${props => props.theme.fontSizeS};
  background-color: ${props => props.theme.inputBG};
  border-radius: ${props => props.theme.radius};
`;

const ImportEntityPreview: FunctionComponent<Props> = props => {
  return <Container>{props.entity.name}</Container>;
};

export default ImportEntityPreview;
