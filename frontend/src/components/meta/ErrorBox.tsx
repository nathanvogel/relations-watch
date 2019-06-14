import React, { ReactNode } from "react";
import styled from "styled-components";

type Props = {
  // status?: Status | null;
  // error?: ErrorPayload | null;
  className?: string; // For styled-components
  children: ReactNode;
};

const Box = styled.div`
  padding: ${props => props.theme.blockPadding};
  background-color: ${props => props.theme.errorBG};
  border-radius: ${props => props.theme.bigRadius};
`;

export default function ErrorBox(props: Props) {
  return <Box className={props.className}>Error: {props.children}</Box>;
}
