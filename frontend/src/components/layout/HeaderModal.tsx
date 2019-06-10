import React from "react";
import styled from "styled-components";
import ModalBackground from "./ModalBackground";

interface ModalProps {
  fullyVisible: boolean;
}

const ModalContent = styled.div<ModalProps>`
  position: fixed;
  box-sizing: border-box;
  width: calc(
    100% - ${props => props.theme.marginLR} - ${props => props.theme.marginLR}
  );
  max-width: 800px;
  min-height: 150px;
  height: ${props => (props.fullyVisible ? "auto" : "150px")}
  max-height: ${props => (props.fullyVisible ? "calc(100vh - 30px)" : "150px")}
  overflow-y: auto;
  top: calc(100vh - 150px);
  left: 50%;
  transition: transform 0.3s ease-out;
  transform: translateX(calc(-50% - ${props => props.theme.marginLR}))
    translateY(${props =>
      props.fullyVisible ? "calc(-100% + 150px)" : "0px"});
  z-index: 3000;

  padding: ${props => props.theme.blockPadding};
  padding-bottom: ${props =>
    props.fullyVisible ? props.theme.blockPadding : "0px"}
  margin-bottom: 0px;
  margin-left: ${props => props.theme.marginLR};
  margin-right: ${props => props.theme.marginLR};

  background-color: ${props => props.theme.appBG};
  // box-shadow: 0px 0px ${props => (props.fullyVisible ? "4px" : "0px")} 0px
  //   rgba(0, 0, 0, 0.2);
  border-style: solid;
  border-width: ${props => props.theme.strongBorderWidth};
  border-color: ${props => props.theme.darkBG};
  border-bottom: none;
  border-radius: ${props => props.theme.radius} ${props => props.theme.radius}
    0px 0px;
`;

const OptionalModalBackground = styled(ModalBackground)<ModalProps>`
  ${props => (props.fullyVisible ? "" : "pointer-events: none;")}
  opacity: ${props => (props.fullyVisible ? 0.7 : 0)};
  transition: opacity 0.5s ease-out;
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
        {props.header}
        {props.children}
      </ModalContent>
    </div>
  );
};

export default HeaderModal;
