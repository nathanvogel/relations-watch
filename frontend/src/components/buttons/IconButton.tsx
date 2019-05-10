import styled from "styled-components";
import { TP } from "../../utils/theme";

const IconButton = styled.button`
  min-height: 28px;
  min-width: 28px;
  padding: ${(props: TP) => props.theme.inputPaddingTB};
  background-color: ${(props: TP) => props.theme.inputBG};
  border-color: ${(props: TP) => props.theme.inputBG};
  border-width: ${(props: TP) => props.theme.borderWidth};
  border-style: solid;
  border-radius: ${(props: TP) => props.theme.radius};

  cursor: pointer;
  color: inherit;

  &:hover {
    background-color: ${(props: TP) => props.theme.borderHover};
    border-color: ${(props: TP) => props.theme.borderHover};
  }

  &:focus {
    border-color: ${(props: TP) => props.theme.focusColor};
    outline: none;
  }
`;

export default IconButton;
