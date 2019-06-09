import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { ReactComponent as AppIcon } from "../../assets/ic_app_white.svg";

const Container = styled.div`
  height: ${props => props.theme.navBarHeight};
  width: ${props => props.theme.appSidebarWidth};
  background: ${props => props.theme.darkBG};
  color: white;
  font-size: 23px;
  font-family: ${props => props.theme.brandFont};
  padding-left: ${props => props.theme.marginLR};
  box-sizing: border-box;
  display: flex;
  align-items: center;

  // Adjust towards the top
  & > span {
    padding-bottom: 3px;
  }
  & > span,
  & > svg {
    opacity: 1;
    transition: opacity 0.5s ease-out;
  }
`;

const StyledAppIcon = styled(AppIcon)`
  height: 40px;
  width: 40px;
  margin-right: 10px;
`;

const HomeLink = styled(Link)`

  &:link,
  &:active,
  &:visited {
    text-decoration: none;
    // color: ${props => props.theme.mainTextColor};
  }

  &:hover span,
  &:hover svg {
    text-decoration: none;
    opacity: 0;
  }
`;

const WebsiteTitle: React.FunctionComponent = props => (
  <div>
    <HomeLink to="/">
      <Container>
        <StyledAppIcon />
        <span>
          <strong>relations.</strong>watch
        </span>
      </Container>
    </HomeLink>
  </div>
);

export default WebsiteTitle;
