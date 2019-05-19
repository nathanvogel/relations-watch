import { css } from "styled-components";

const SourceListItemContainerCSS = css`
  background-color: ${props => props.theme.lightBG};
  padding: ${props => props.theme.blockPadding};
  border-radius: ${props => props.theme.radius};
  margin-top: ${props => props.theme.blockSpacingTB};
  margin-bottom: ${props => props.theme.blockSpacingTB};
`;

export default SourceListItemContainerCSS;
