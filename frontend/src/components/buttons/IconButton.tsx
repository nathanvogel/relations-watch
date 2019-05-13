import styled from "styled-components";
import { TP } from "../../utils/theme";

const IconButton = styled.button`
  height: auto;
  min-height: 28px;
  min-width: 28px;
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
`;

export default IconButton;
