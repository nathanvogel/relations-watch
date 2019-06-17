import React from "react";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import ClickableIcon from "../buttons/ClickableIcon";
import { mediaq } from "../../styles/responsive-utils";

const Background = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  // Above the drawer on desktop
  z-index: 2999;
  ${mediaq.mobile} {
    // Below the drawer on mobile
    z-index: 999;
  }
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

const Cross = styled(ClickableIcon)`
  position: absolute;
  top: 6px;
  right: 12px;
`;

type Props = {
  onClick?: () => void;
  className?: string;
  withCross?: boolean;
};

const ModalBackground: React.FunctionComponent<Props> = props => (
  <Background {...props}>
    {props.withCross && (
      <Cross>
        <CloseIcon />
      </Cross>
    )}
  </Background>
);

export default ModalBackground;
