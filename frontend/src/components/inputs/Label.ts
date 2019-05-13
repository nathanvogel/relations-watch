import styled from "styled-components";
import { TP } from "../../utils/theme";

const Label = styled.div`
  color: ${(props: TP) => props.theme.secondaryTextColor};
  margin: ${(props: TP) => props.theme.marginTB} 0px;
  margin-bottom: ${(props: TP) => props.theme.inputTBSpacing};
`;

export default Label;
