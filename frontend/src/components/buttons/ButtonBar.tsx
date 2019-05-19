import styled from "styled-components";

type Props = {
  buttonsAlign?: string;
};

const ButtonBar = styled.div`
  text-align: ${(props: Props) => props.buttonsAlign || "left"};
  margin: ${props => props.theme.inputTBSpacing} -${props => props.theme.inputLRSpacing};

  & > * {
    margin: ${props => props.theme.inputTBSpacing}
      ${props => props.theme.inputLRSpacing};
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
