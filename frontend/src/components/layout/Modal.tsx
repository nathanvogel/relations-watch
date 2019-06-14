import React from "react";
import styled from "styled-components";
import ModalBackground from "./ModalBackground";
import ReactDOM from "react-dom";

const ModalContent = styled.div`
  position: fixed;
  box-sizing: border-box;
  width: calc(
    100% - ${props => props.theme.marginLR} - ${props => props.theme.marginLR}
  );
  max-width: 900px;
  min-height: 400px;
  max-height: calc(100vh - 110px);
  overflow-y: auto;
  top: 70px;
  left: 50%;
  transform: translateX(calc(-50% - ${props => props.theme.marginLR}));
  z-index: 4000;
  padding: ${props => props.theme.blockPadding};
  margin-bottom: ${props => props.theme.marginTB};
  margin-left: ${props => props.theme.marginLR};
  margin-right: ${props => props.theme.marginLR};

  background-color: ${props => props.theme.appBG};
  // box-shadow: 0px 0px 28px 0px rgba(0, 0, 0, 0.5);
  border-style: solid;
  border-color: ${props => props.theme.border};
  border-width: ${props => props.theme.borderWidth};
  border-radius: ${props => props.theme.bigRadius};
`;

const MyModalBackground = styled(ModalBackground)`
  z-index: 3999;
`;

type Props = {
  onClose?: () => void;
};

const Modal: React.FunctionComponent<Props> = props => {
  const modals = document.getElementById("modals");
  const modal = (
    <div>
      <MyModalBackground onClick={props.onClose} withCross />
      <ModalContent>{props.children}</ModalContent>
    </div>
  );
  // Avoid z-index or position:fixed with transform issues
  if (modals) return ReactDOM.createPortal(modal, modals);
  else {
    console.warn(
      "Warning: 'modals' could not be found. Rendering modal directly " +
        "in nested DOM structure, this can lead to issues with " +
        "position:fixed elements with a transform attribute for example"
    );
    return modal;
  }
};

export default Modal;
