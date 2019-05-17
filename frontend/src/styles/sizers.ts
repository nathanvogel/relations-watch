import { css } from "styled-components";
import { TP } from "./theme";

export const PageWidthSizer = css`
  width: calc(
    100% - ${(props: TP) => props.theme.appPaddingLR}; -
      ${(props: TP) => props.theme.appPaddingLR};
  );
  max-width: ${(props: TP) => props.theme.appMaxWidth};
  margin: 0 auto;
`;

export const PagePadder = css`
  padding-left: ${(props: TP) => props.theme.appPaddingLR};
  padding-right: ${(props: TP) => props.theme.appPaddingLR};
  padding-top: ${(props: TP) => props.theme.appPaddingTB};
  padding-bottom: ${(props: TP) => props.theme.appPaddingTB};
  box-sizing: border-box;
`;
