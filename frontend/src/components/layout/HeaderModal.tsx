import React from "react";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import ModalBackground from "./ModalBackground";
import { mediaq } from "../../styles/responsive-utils";
import ClickableIcon from "../buttons/ClickableIcon";

interface ModalProps {
  fullyVisible: boolean;
  allowOverflow?: boolean;
}

const ModalContent = styled.div<ModalProps>`
  position: fixed;
  box-sizing: border-box;

  min-height: ${props => props.theme.hoverBoxHeight};
  height:
    ${props =>
      props.fullyVisible ? "calc(100vh - 50px)" : props.theme.hoverBoxHeight};
  max-height:
    ${props =>
      props.fullyVisible ? "calc(100vh - 50px)" : props.theme.hoverBoxHeight};
  // overflow-y: auto;
  top: calc(100vh - ${props => props.theme.hoverBoxHeight});

  width: calc(
    100% - ${props => props.theme.marginLR} - ${props => props.theme.marginLR}
  );
  max-width: 900px;
  left: 50%;
  transition: transform ${props => props.theme.longAnim} ease-out;
  transform:
    translateX(calc(-50% - ${props => props.theme.marginLR}))
    translateY(${props =>
      props.fullyVisible
        ? `calc(-100% + ${props.theme.hoverBoxHeight})`
        : "0px"});
  // Above the drawer on desktop
  z-index: 3000;
  ${mediaq.mobile} {
    // Below the drawer on mobile
    z-index: 1000;
  }

  padding: 0px;
  margin-bottom: 0px;
  margin-left: calc(${props => props.theme.marginLR} + ${props =>
  props.theme.appSidebarWidth} * 0.5);
  margin-right: ${props => props.theme.marginLR};

  // background-color: ${props => props.theme.modalBG};
  background-color: ${props =>
    props.fullyVisible ? props.theme.modalBG : props.theme.modalPreviewBG};


  border-style: solid solid none solid;
  border-width: ${props => props.theme.strongBorderWidth};
  border-color: ${props => props.theme.darkBG};
  border-bottom: none;
  border-radius: ${props => props.theme.bigRadius} ${props =>
  props.theme.bigRadius}
    0px 0px;

  // box-shadow: 0px 3px 10px 10px rgba(0, 0, 0, 0.05);
  // border-width: 0px;
  // border-radius: 5px 5px 0px 0px;


  ${props => mediaq.custom(parseInt(props.theme.appSidebarWidth) + 900)} {
    max-width: calc(100vw - ${props => props.theme.appSidebarWidth});
    border-style: solid none none ${props =>
      props.fullyVisible ? "solid" : "none"};
    border-radius:0px 0px 0px 0px;
  }

  ${mediaq.desktop} {
    max-width: 100vw;
    margin-left: ${props => props.theme.marginLR};
    border-style: solid solid none solid;
    border-radius: ${props => props.theme.bigRadius} ${props =>
  props.theme.bigRadius}
      0px 0px;
  }

  display: flex;
  flex-direction: column;
`;

const OptionalModalBackground = styled(ModalBackground)<ModalProps>`
  ${props => (props.fullyVisible ? "" : "pointer-events: none;")}
  opacity: ${props => (props.fullyVisible ? 1 : 0)};
  transition: opacity ${props => props.theme.longAnim} ease-out;
`;

const PositionedClickableIcon = styled(ClickableIcon)`
  position: absolute;
  top: -32px;
  left: calc(50% - 11px);
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: ${props => props.theme.blockPadding};
`;

type Props = {
  onClose?: () => void;
  header?: React.ReactNode;
  fullyVisible: boolean;
};

const HeaderModal: React.FunctionComponent<Props> = props => {
  return (
    <div className="HeaderModal">
      <OptionalModalBackground
        fullyVisible={props.fullyVisible}
        onClick={props.onClose}
      />
      <ModalContent fullyVisible={props.fullyVisible}>
        {props.fullyVisible && (
          <PositionedClickableIcon onClick={props.onClose}>
            <CloseIcon />
          </PositionedClickableIcon>
        )}
        {props.header}

        {props.fullyVisible && (
          <ContentWrapper>{props.children}</ContentWrapper>
        )}
      </ModalContent>
    </div>
  );
};

export default HeaderModal;
