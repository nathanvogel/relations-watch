import React from "react";
import styled from "styled-components";
import { withRouter, RouteComponentProps } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";

import EntitySearch from "./EntitySearch";
import ROUTES from "../utils/ROUTES";
import { EntitySelectOption } from "../utils/types";
import IconButton from "./buttons/IconButton";
// import { ReactComponent as MenuIcon } from "../assets/ic_main_menu.svg";
import { Mobile } from "../styles/responsive-utils";

const Bar = styled.nav`
  display: block;
  height: ${props => props.theme.navBarHeight};
  background: ${props => props.theme.appBarBG};
  border-bottom: solid ${props => props.theme.strongBorderWidth}
    ${props => props.theme.strongBorder};
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
  & > *:last-child {
    margin-right: 0px;
  }

  button,
  a {
    height: 100%;
    max-height: 100%;
    margin-left: ${props => props.theme.marginLR};
    margin-right: ${props => props.theme.marginLR};
    box-sizing: border-box;
  }
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

  onSearch = (option: EntitySelectOption) => {
    this.setState({ searchValue: "" });
    const url = `/${ROUTES.entity}/${option.value}`;
    this.props.history.push(url);
  };

  render() {
    return (
      <Bar aria-label="Navigation bar">
        <BarContent>
          <Mobile>
            <IconButton onClick={this.props.onLeftMenuClick}>
              <MenuIcon />
            </IconButton>
          </Mobile>
          {this.props.location.pathname !== "/" && (
            <StyledSearch
              onChange={this.onSearch}
              onInputChange={this.onInputChange}
              inputValue={this.state.searchValue}
              selection={null}
            />
          )}
          {this.props.children}
        </BarContent>
      </Bar>
    );
  }
}

export default withRouter(AppBar);
