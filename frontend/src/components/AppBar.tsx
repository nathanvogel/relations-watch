import React from "react";
import styled from "styled-components";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";

import EntitySearch from "./EntitySearch";
import ROUTES from "../utils/ROUTES";
import { ReactSelectOption } from "../utils/types";
import IconButton from "./buttons/IconButton";
import { ReactComponent as MenuIcon } from "../assets/ic_main_menu.svg";
import { Mobile } from "../styles/responsive-utils";

const Bar = styled.nav`
  display: block;
  height: ${props => props.theme.navBarHeight};
  background: ${props => props.theme.lightBG};
  border-bottom: solid 1px ${props => props.theme.darkBG};
  box-sizing: border-box;
`;

const BarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${props => props.theme.navBarHeight};
  box-sizing: border-box;
  padding-left: ${props => props.theme.marginLR};
  padding-right: ${props => props.theme.marginLR};
  padding-top: 6px;
  padding-bottom: 6px;

  & > *:first-child {
    margin-left: 0px;
  }
`;

const AppBarButton = styled(IconButton)`
  height: 100%;
  max-height: 100%;
  margin-left: ${props => props.theme.marginLR};
  margin-right: ${props => props.theme.marginLR};
  box-sizing: border-box;
  display: flex;
  align-items: center;
`;

const StyledSearch = styled(EntitySearch)`
  flex-grow: 1;
  & > .rs__control {
    height: 100%;
  }
  // margin-left: ${props => props.theme.marginLR};
  // margin-right: ${props => props.theme.marginLR};
  height: 100%;
  width: 150px;
  min-width: 60px;
  max-width: 100%;
  box-sizing: border-box;
`;

type Props = {
  onLeftMenuClick?: () => void;
} & RouteComponentProps;

type State = {
  searchValue: string;
};

class AppBar extends React.Component<Props> {
  readonly state: State = {
    searchValue: "",
  };

  onInputChange = (value: string) => {
    this.setState({ searchValue: value });
  };

  onSearch = (option: ReactSelectOption) => {
    this.setState({ searchValue: "" });
    const url = `/${ROUTES.entity}/${option.value}`;
    this.props.history.push(url);
  };

  render() {
    return (
      <Bar>
        <BarContent>
          <Mobile>
            <AppBarButton onClick={this.props.onLeftMenuClick}>
              <MenuIcon />
            </AppBarButton>
          </Mobile>
          {this.props.location.pathname !== "/" && (
            <StyledSearch
              onChange={this.onSearch}
              onInputChange={this.onInputChange}
              inputValue={this.state.searchValue}
              selection={null}
            />
          )}
        </BarContent>
      </Bar>
    );
  }
}

export default withRouter(AppBar);
