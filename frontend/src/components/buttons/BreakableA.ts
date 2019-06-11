import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

const breakableCSS = css`
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word;
`;

const BreakableA = styled.a`
  ${breakableCSS}
`;

export const BreakableLink = styled(Link)`
  ${breakableCSS}
`;

export default BreakableA;
