import styled, { css } from "styled-components";
import { TP } from "../../styles/theme";

export const cssInput = css`
  padding-left: ${(props: TP) => props.theme.inputPaddingLR};
  padding-right: ${(props: TP) => props.theme.inputPaddingLR};
  padding-top: ${(props: TP) => props.theme.inputPaddingTB};
  padding-bottom: ${(props: TP) => props.theme.inputPaddingTB};

  box-sizing: border-box;
  background-color: ${(props: TP) => props.theme.inputBG};
  border-color: ${(props: TP) => props.theme.inputBG};
  border-width: ${(props: TP) => props.theme.borderWidth};
  border-style: solid;
  border-radius: ${(props: TP) => props.theme.radius};

  &:hover {
    border-color: ${(props: TP) => props.theme.borderHover};
  }

  &:focus {
    border-color: ${(props: TP) => props.theme.focusColor};
    outline: none;
  }
`;

const Input = styled.input`
  ${cssInput}
`;

export default Input;
