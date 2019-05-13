import styled from "styled-components";
import { TP } from "../../utils/theme";

type Props = {
  buttonsAlign?: string;
};

const ButtonBar = styled.div`
  text-align: ${(props: Props) => props.buttonsAlign || "left"};
  margin: ${(props: TP) => props.theme.inputTBSpacing} -${(props: TP) => props.theme.inputLRSpacing};

  & > * {
    margin: ${(props: TP) => props.theme.inputTBSpacing}
      ${(props: TP) => props.theme.inputLRSpacing};
  }

  // *:first-child {
  //   margin-left: 0px;
  // }
  //
  // *:last-child {
  //   margin-right: 0px;
  // }
`;

export default ButtonBar;
