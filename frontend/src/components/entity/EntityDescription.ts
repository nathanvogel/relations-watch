import styled from "styled-components";

const EntityDescription = styled.div`
  // white-space: nowrap;
  // text-overflow: ellipsis;
  // overflow: hidden;
  color: ${props => props.theme.mainTextColor};
  font-size: ${props => props.theme.fontSizeS};
  text-decoration: none;
  // Small trick to make sure text-decoration: none is applied on hover too
  // https://stackoverflow.com/questions/25762427/remove-underline-only-from-anchor-element-child
  display: inline-block;
`;

export default EntityDescription;
