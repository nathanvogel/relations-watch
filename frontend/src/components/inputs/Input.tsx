import styled, { css } from "styled-components";

export const cssInput = css`
  padding-left: ${props => props.theme.inputPaddingLR};
  padding-right: ${props => props.theme.inputPaddingLR};
  padding-top: ${props => props.theme.inputPaddingTB};
  padding-bottom: ${props => props.theme.inputPaddingTB};

  box-sizing: border-box;
  background-color: ${props => props.theme.inputBG};
  border-color: ${props => props.theme.inputBG};
  border-width: ${props => props.theme.borderWidth};
  border-style: solid;
  border-radius: ${props => props.theme.radius};

  &:hover {
    border-color: ${props => props.theme.borderHover};
  }

  &:focus {
    border-color: ${props => props.theme.focusColor};
    outline: none;
  }
`;

const Input = styled.input`
  ${cssInput}
`;

export default Input;
