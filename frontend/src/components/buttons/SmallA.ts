import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

const smallCSS = css`
  color: inherit;
  font-size: ${props => props.theme.fontSizeS};
`;

const SmallA = styled.a`
  ${smallCSS}
`;

export const SmallLink = styled(Link)`
  ${smallCSS}
`;

export default SmallA;
