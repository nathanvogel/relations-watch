import styled from "styled-components";

const ModalBackground = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 2999;
  // Don't use opacity, so that it can be animated by another component
  // background-color: rgba(255, 255, 255, 0.9);

  background: rgb(255, 255, 255, 0.8);
  background: radial-gradient(
    circle,
    rgba(240, 239, 253, 0.6) 0%,
    rgba(255, 255, 255, 1) 95%
  );
  background: ${props => props.theme.appBarBG};
`;

export default ModalBackground;
