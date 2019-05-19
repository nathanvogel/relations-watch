import styled, { css } from "styled-components";
import * as React from "react";
import { Link } from "react-router-dom";

type Props = {
  to?: string;
  onClick?: (event: React.MouseEvent) => void;
};

const style = css`
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;

  &:link {
    color: ${props => props.theme.mainTextColor};
  }

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

const Button: React.FunctionComponent<Props> = props => {
  return props.to ? (
    <StyledLink role="button" to={props.to}>
      {props.children}
    </StyledLink>
  ) : (
    <StyledA role="button" onClick={props.onClick}>
      {props.children}
    </StyledA>
  );
};

// export default Button;
