import React from "react";
import styled from "styled-components";
import ModalBackground from "./ModalBackground";

const ModalContent = styled.div`
  position: fixed;
  box-sizing: border-box;
  width: calc(
    100% - ${props => props.theme.marginLR} - ${props => props.theme.marginLR}
  );
  max-width: 800px;
  min-height: 400px;
  max-height: calc(100vh - 110px);
  overflow-y: auto;
  top: 70px;
  left: 50%;
  transform: translateX(calc(-50% - ${props => props.theme.marginLR}));
  z-index: 3000;
  padding: ${props => props.theme.blockPadding};
  margin-bottom: ${props => props.theme.marginTB};
  margin-left: ${props => props.theme.marginLR};
  margin-right: ${props => props.theme.marginLR};

  background-color: ${props => props.theme.appBG};
  // box-shadow: 0px 0px 28px 0px rgba(0, 0, 0, 0.5);
  border-style: solid;
  border-color: ${props => props.theme.border};
  border-width: ${props => props.theme.borderWidth};
  border-radius: ${props => props.theme.radius};
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
