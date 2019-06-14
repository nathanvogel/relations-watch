import React from "react";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";

const Background = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 2999;
  cursor: pointer;
  // Don't use opacity, so that it can be animated by another component
  // background-color: rgba(255, 255, 255, 0.9);

  // background: rgb(255, 255, 255, 0.8);
  // background: radial-gradient(
  //   circle,
  //   rgba(240, 239, 253, 0.6) 0%,
  //   rgba(255, 255, 255, 1) 95%
  // );
  background: ${props => props.theme.modalOverlayBG};
`;

const Cross = styled.div`
  position: absolute;
  top: 6px;
  right: 50px;
  width: 32px;
  height: 32px;
  color: white;
  transition: color ${props => props.theme.shortAnim} ease-out;

  &:hover {
    color: ${props => props.theme.lightFocusColor};
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

type Props = {
  onClick?: () => void;
  className?: string;
};

const ModalBackground: React.FunctionComponent<Props> = props => (
  <Background {...props}>
    <Cross>
      <CloseIcon />
    </Cross>
  </Background>
);

export default ModalBackground;
