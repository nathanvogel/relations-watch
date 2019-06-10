import React, { useState } from "react";
import styled from "styled-components";
import Drawer from "@material-ui/core/Drawer";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";

import { media, Mobile, NotMobile } from "../../styles/responsive-utils";
import AppBar from "../../components/AppBar";
import WebsiteTitle from "../../components/titles/WebsiteTitle";

const Content = styled.div`
  position: relative;
  overflow: hidden;
  // Make room for the drawer
  margin-left: ${props => props.theme.appSidebarWidth};
  ${media.mobile`margin-left: 0;`}
`;

const StyledDrawer = styled(Drawer)`
  border-right: none;

  .MuiDrawer-paperAnchorDockedLeft {
    border-right: none;
  }
` as typeof Drawer;
// = necessary hack for now
// https://github.com/mui-org/material-ui/issues/13921#issuecomment-484133463

const DrawerWrapper = styled.div`
  // Colors
  background-color: ${props => props.theme.sidebarBG};
  border-right: solid ${props => props.theme.strongBorderWidth}
    ${props => props.theme.darkBG};
  // Size
  box-sizing: border-box;
  height: 100%;
  max-height: 100%;
  min-width: ${props => props.theme.appSidebarWidth};
  width: ${props => props.theme.appSidebarWidth};
`;

const DrawerContent = styled.div`
  // Size
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  max-height: calc(100vh - ${props => props.theme.navBarHeight});
  overflow-y: auto;
  // Color
  background-color: ${props => props.theme.sidebarBG};
`;

type Props = {
  drawerContent?: React.ReactNode;
  // appBarContent?: React.ReactNode; // no customization needed for now
  // mainContent?: React.ReactNode; // use props.children instead
};

const DrawerLayout: React.FunctionComponent<Props> = props => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerContent = (
    <DrawerWrapper>
      <WebsiteTitle />
      <DrawerContent>{props.drawerContent}</DrawerContent>
    </DrawerWrapper>
  );

  return (
    <Content>
      {/* NAVBAR */}
      <AppBar onLeftMenuClick={() => setMobileOpen(!mobileOpen)} />
      <nav aria-label="Sidebar">
        <Mobile>
          <SwipeableDrawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onOpen={() => setMobileOpen(true)}
            onClose={() => setMobileOpen(false)}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {/* DRAWER CONTENT */}
            {drawerContent}
          </SwipeableDrawer>
        </Mobile>
        <NotMobile>
          <StyledDrawer variant="permanent" open>
            {/* DRAWER CONTENT */}
            {drawerContent}
          </StyledDrawer>
        </NotMobile>
      </nav>
      {/* MAIN CONTENT */}
      {props.children}
    </Content>
  );
};

export default DrawerLayout;
