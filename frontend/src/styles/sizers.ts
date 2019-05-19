import { css } from "styled-components";

export const PageWidthSizer = css`
  width: calc(
    100% - ${props => props.theme.appPaddingLR}; -
      ${props => props.theme.appPaddingLR};
  );
  max-width: ${props => props.theme.appMaxWidth};
  margin: 0 auto;
`;

export const PagePadder = css`
  padding-left: ${props => props.theme.appPaddingLR};
  padding-right: ${props => props.theme.appPaddingLR};
  padding-top: ${props => props.theme.appPaddingTB};
  padding-bottom: ${props => props.theme.appPaddingTB};
  box-sizing: border-box;
`;
