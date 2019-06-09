import React from "react";
import styled from "styled-components";
import ModalBackground from "./ModalBackground";

interface ModalProps {
  fullyVisible: boolean;
}

const ModalContent = styled.div<ModalProps>`
  position: fixed;
  box-sizing: border-box;
  width: calc(100% - ${props => props.theme.marginLR} - ${props =>
  props.theme.marginLR});
  max-width: 800px;
  min-height: 400px;
  max-height: calc(100vh - 110px);
  overflow-y: auto;
  bottom: -300px;
  left: 50%;
  transition: transform 0.3s ease-out;
  transform:
   translateX(calc(-50% - ${props => props.theme.marginLR}))
   translateY(${props =>
     props.fullyVisible ? "calc(-100vh + 300px)" : "0px"});
  z-index: 3000;
  padding: ${props => props.theme.blockPadding};
  margin-bottom: ${props => props.theme.marginTB};
  margin-left: ${props => props.theme.marginLR};
  margin-right: ${props => props.theme.marginLR};

  background-color: ${props => props.theme.appBG};
  // box-shadow: 0px 0px 28px 0px rgba(0, 0, 0, 0.5);
  border-style: solid
  border-color: ${props => props.theme.border};
  border-width: ${props => props.theme.borderWidth};
  border-radius: ${props => props.theme.radius};
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
