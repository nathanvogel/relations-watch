import styled from "styled-components";

const SecondaryTitle = styled.h3`
  color: ${props => props.theme.mainTextColor};
  font-size: ${props => props.theme.fontSizeL};
  font-weight: bold;
  font-family: ${props => props.theme.brandFont};
`;

export default SecondaryTitle;
