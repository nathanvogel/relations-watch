import styled, { css } from "styled-components";

type Props = {
  withButton?: boolean;
};

const withButton = css`
  padding-top: 32px; // For the close button
`;

// Export to style buttons like the editor
export const EditorContainerCSS = css`
  display: block;
  position: relative; // Needed to position:absolute the close button
  border-style: solid;
  border-width: ${props => props.theme.borderWidth};
  border-color: ${props => props.theme.border};
  border-radius: ${props => props.theme.bigRadius};
  padding: ${props => props.theme.blockPadding};
  margin-top: ${props => props.theme.blockSpacingTB};
  margin-bottom: ${props => props.theme.blockSpacingTB};
`;

const EditorContainer = styled.div<Props>`
  ${props => props.withButton && withButton}
  ${EditorContainerCSS}
`;

export default EditorContainer;
