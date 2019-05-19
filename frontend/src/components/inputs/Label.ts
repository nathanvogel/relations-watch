import styled from "styled-components";

const Label = styled.label`
  display: block;
  color: ${props => props.theme.secondaryTextColor};
  margin: ${props => props.theme.marginTB} 0px;
  margin-bottom: ${props => props.theme.inputTBSpacing};
`;

export default Label;
