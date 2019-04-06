import styled, { css } from "styled-components";
import * as React from "react";
import { Link } from "react-router-dom";

export interface Props {
  children: string;
  to?: string;
}

const style = css`
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  color: inherit;

  &:hover {
    opacity: 0.7;
  }
`;

const StyledLink = styled(Link)`
  ${style}
`;
const StyledA = styled("a")`
  ${style}
`;

function Button(props: Props) {
  return props.to ? (
    <StyledLink role="button" to={props.to}>
      {props.children}
    </StyledLink>
  ) : (
    <StyledA role="button">{props.children}</StyledA>
  );
}

export default Button;
