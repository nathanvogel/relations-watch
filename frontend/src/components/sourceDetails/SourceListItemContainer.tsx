import { css } from "styled-components";
import { TP } from "../../styles/theme";

const SourceListItemContainerCSS = css`
  background-color: ${(props: TP) => props.theme.lightBG};
  padding: ${(props: TP) => props.theme.blockPadding};
  border-radius: ${(props: TP) => props.theme.radius};
  margin-top: ${(props: TP) => props.theme.blockSpacingTB};
  margin-bottom: ${(props: TP) => props.theme.blockSpacingTB};
`;

export default SourceListItemContainerCSS;
