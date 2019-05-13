import styled, { css } from "styled-components";
import { TP } from "../utils/theme";

const withButton = css`
  padding-top: 32px; // For the close button
`;

// Export to style buttons like the editor
export const EditorContainerCSS = css`
  display: block;
  position: relative; // Needed to position:absolute the close button
  border-style: solid;
  border-width: ${(props: TP) => props.theme.borderWidth};
  border-color: ${(props: TP) => props.theme.border};
  border-radius: ${(props: TP) => props.theme.radius};
  padding: ${(props: TP) => props.theme.blockPadding};
  margin-top: ${(props: TP) => props.theme.blockSpacingTB};
  margin-bottom: ${(props: TP) => props.theme.blockSpacingTB};
`;

const EditorContainer = styled.div`
  ${props => props.withButton && withButton}
  ${EditorContainerCSS}
`;

export default EditorContainer;
