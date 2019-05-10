import styled from "styled-components";
import { TP } from "../../utils/theme";
import Input from "./Input";
import React from "react";

const InputStyledAsTextArea = styled(Input)`
  display: block;
  width: 100%;
  min-height: ${(props: TP) => props.theme.longFieldHeight};
`;

const TextArea: React.FunctionComponent<
  React.HTMLProps<HTMLTextAreaElement>
> = (props: any) => <InputStyledAsTextArea as={"textarea"} {...props} />;

export default TextArea;
