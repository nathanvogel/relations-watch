import styled from "styled-components";

export const MiniInfoText = styled.p`
  font-size: ${props => props.theme.fontSizeS};
  color: ${props => props.theme.secondaryTextColor};
  margin-top: ${props => props.theme.inputTBSpacing};
  margin-bottom: ${props => props.theme.inputTBSpacing};
`;
