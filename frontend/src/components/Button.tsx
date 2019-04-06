import styled from "styled-components";
import * as React from "react";

export interface Props {
  children: string;
}

const StyledLink = styled("a")`
  font-weight: 700;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

function Button({ children }: Props) {
  return <StyledLink role="button">{children}</StyledLink>;
}

export default Button;
