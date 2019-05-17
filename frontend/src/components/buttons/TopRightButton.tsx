import React from "react";
import styled from "styled-components";
import IconButton from "../buttons/IconButton";
import { TP } from "../../styles/theme";

interface Props {
  className?: string;
}

const StyledButton = styled(IconButton)`
  display: block;
  position: absolute;
  padding: 0px; // there's still the border
  height: auto; // override the other height
  border-radius: 0px ${(props: TP) => props.theme.radius} 0px
    ${(props: TP) => props.theme.radius};
  top: -${(props: TP) => props.theme.borderWidth};
  right: -${(props: TP) => props.theme.borderWidth};
`;

const TopRightButton: React.FunctionComponent<
  React.HTMLProps<typeof StyledButton>
> = (props: any) => <StyledButton {...props} />;

export default TopRightButton;
