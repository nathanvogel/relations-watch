import styled from "styled-components";

type Props = {
  big?: boolean;
};

const EntityName = styled.div<Props>`
  font-weight: ${props => (props.big ? "bold" : "normal")};
  font-size: ${props =>
    props.big ? props.theme.fontSizeL : props.theme.fontSizeM};
  font-family: ${props => props.theme.mainFont};
  transition: all ${props => props.theme.longAnim} ease-out;
`;

export default EntityName;
