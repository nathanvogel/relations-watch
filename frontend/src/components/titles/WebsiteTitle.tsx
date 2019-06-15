import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { ReactComponent as AppIcon } from "../../assets/ic_app_white.svg";
import { mediaq } from "../../styles/responsive-utils";

const Container = styled.div`
  height: ${props => props.theme.navBarHeight};
  width: ${props => props.theme.appSidebarWidth};
  // Avoid weird scaling on very small mobiles
  ${mediaq.mobile} {
    width: auto;
  }
  box-sizing: border-box;
  padding: 0px;

  font-size: 24px;
  font-weight: 300;
  font-family: ${props => props.theme.brandFont};

  strong {
    font-weight: bold;
  }
`;

const LogoWrapper = styled.div`
  background: ${props => props.theme.mainTextColor};
  color: ${props => props.theme.lightTextColor};
  padding-left: ${props => props.theme.marginLR};
  height: 100%;
  width: 100%;
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  // Adjust towards the top
  & > span {
    padding-bottom: 1px;
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
        <LogoWrapper>
          <StyledAppIcon />
          <span>
            <strong>relations.</strong>watch
          </span>
        </LogoWrapper>
      </Container>
    </HomeLink>
  </div>
);

export default WebsiteTitle;
