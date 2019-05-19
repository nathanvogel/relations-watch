import styled from "styled-components";

const VerticalInputBar = styled.div`
  & > * {
    margin: ${props => props.theme.inputTBSpacing} 0px;
  }

  & > *:first-child {
    margin-top: 0px;
  }

  & > *:last-child {
    margin-bottom: 0px;
  }
`;

export default VerticalInputBar;
