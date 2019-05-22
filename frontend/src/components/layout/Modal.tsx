import React from "react";
import styled from "styled-components";

const ModalContent = styled.div`
  position: fixed;
  width: 100%;
  max-width: 800px;
  min-height: 400px;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  padding: ${props => props.theme.blockPadding};
  margin-bottom: ${props => props.theme.marginTB};

  background-color: ${props => props.theme.appBG};
  // box-shadow: 0px 0px 28px 0px rgba(0, 0, 0, 0.5);
  border-style: solid
  border-color: ${props => props.theme.border};
  border-width: ${props => props.theme.borderWidth};
  border-radius: ${props => props.theme.radius};
`;

const ModalBackground = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 999;
  background-color: rgba(255, 255, 255, 0.7);
`;

type Props = {
  onClose?: () => void;
};

const Modal: React.FunctionComponent<Props> = props => {
  return (
    <div>
      <ModalBackground onClick={props.onClose} />
      <ModalContent>{props.children}</ModalContent>
    </div>
  );
};

export default Modal;
