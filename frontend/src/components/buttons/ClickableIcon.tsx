import styled from "styled-components";

const ClickableIcon = styled.div`
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.55;
    }
  }

  display: block;
  width: 22px;
  height: 22px;
  color: white;
  opacity: 0.55;
  cursor: pointer;
  animation: fadein ${props => props.theme.longAnim};
  transition: transform ${props => props.theme.shortAnim} ease-out,
    opacity ${props => props.theme.shortAnim} ease-out;
  transform: scale(1);

  &:hover {
    // color: ${props => props.theme.lightFocusColor};
    transform: scale(1.2);
    opacity: 1;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

export default ClickableIcon;
