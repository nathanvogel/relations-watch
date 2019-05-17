import styled, { css } from "styled-components";
import { TP } from "../../styles/theme";

const withTextCSS = css`
  margin-right: ${(props: TP) => props.theme.inputLRSpacing};
`;

const IconButton = styled.button.attrs({ type: "button" })`
  height: auto;
  min-height: ${props => (props.small ? "16px" : "28px")};
  min-width: ${props => (props.small ? "16px" : "28px")};
  font-size: ${(props: TP) => (props.small ? props.theme.fontSizeS : "inherit")}
  padding: ${(props: TP) => props.theme.inputPaddingTB}
    ${(props: TP) => props.theme.inputPaddingLR};
  background-color: ${(props: TP) => props.theme.inputBG};
  border-color: ${(props: TP) => props.theme.inputBG};
  border-width: ${(props: TP) => props.theme.borderWidth};
  border-style: solid;
  border-radius: ${(props: TP) => props.theme.radius};

  cursor: pointer;
  color: inherit;

  &:not([disabled]):hover {
    background-color: ${(props: TP) => props.theme.surfaceHover};
    border-color: ${(props: TP) => props.theme.surfaceHover};
  }

  &:focus {
    border-color: ${(props: TP) => props.theme.focusColor};
    outline: none;
  }

  &:disabled {
    color: ${(props: TP) => props.theme.secondaryTextColor};
    cursor: not-allowed;
  }

  & > svg {
    ${props => props.withText && withTextCSS}
  }
`;

export default IconButton;
