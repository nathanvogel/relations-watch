import styled from "styled-components";
import { TP } from "../../utils/theme";
import { cssInput } from "./Input";

const TextArea = styled.textarea`
  ${cssInput}

  display: block;
  width: 100%;
  min-height: ${(props: TP) => props.theme.longFieldHeight};
`;

// const TextArea: React.FunctionComponent<
//   React.HTMLProps<HTMLTextAreaElement>
// > = (props: any) => <InputStyledAsTextArea as={"textarea"} {...props} />;

export default TextArea;
