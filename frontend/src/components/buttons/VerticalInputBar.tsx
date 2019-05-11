import styled from "styled-components";
import { TP } from "../../utils/theme";

const VerticalInputBar = styled.div`
  & > * {
    margin: ${(props: TP) => props.theme.inputTBSpacing} 0px;
  }

  & > *:first-child {
    margin-top: 0px;
  }

  & > *:last-child {
    margin-bottom: 0px;
  }
`;

export default VerticalInputBar;
