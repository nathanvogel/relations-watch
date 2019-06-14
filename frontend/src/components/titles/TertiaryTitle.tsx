import styled from "styled-components";

const TertiaryTitle = styled.h4`
  margin-top: ${props => props.theme.marginTB};
  margin-bottom: 2px;
  color: ${props => props.theme.secondaryTextColor};
  font-family: ${props => props.theme.brandFont};
  font-size: ${props => props.theme.fontSizeM};
  font-weight: 300;
  text-transform: uppercase;
`;

export default TertiaryTitle;
