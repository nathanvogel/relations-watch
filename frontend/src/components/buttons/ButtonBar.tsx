import styled from "styled-components";
import { TP } from "../../utils/theme";

const ButtonBar = styled.div`
  & > * {
    margin: 0px ${(props: TP) => props.theme.inputLRSpacing};
  }

  *:first-child {
    margin-left: 0px;
  }

  *:last-child {
    margin-right: 0px;
  }
`;

export default ButtonBar;
