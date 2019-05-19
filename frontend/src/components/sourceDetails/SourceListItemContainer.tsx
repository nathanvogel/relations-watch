import { css } from "styled-components";

type Props = {
  isRefuting?: boolean;
};

const SourceListItemContainerCSS = css<Props>`
  background-color: ${props =>
    props.isRefuting
      ? props.theme.refutingBackgroundColor
      : props.theme.lightBG};
  padding: ${props => props.theme.blockPadding};
  border-radius: ${props => props.theme.radius};
  margin-top: ${props => props.theme.blockSpacingTB};
  margin-bottom: ${props => props.theme.blockSpacingTB};
`;

export default SourceListItemContainerCSS;
