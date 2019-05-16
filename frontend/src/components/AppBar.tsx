import React from "react";
import styled from "styled-components";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";

import EntitySearch from "./EntitySearch";
import ROUTES from "../utils/ROUTES";
import { TP } from "../utils/theme";
import { ReactSelectOption } from "../utils/types";
import IconButton from "./buttons/IconButton";
import { ReactComponent as AddIcon } from "../assets/ic_add.svg";
import { ReactComponent as AppIcon } from "../assets/ic_app.svg";

const Bar = styled.nav`
  display: block;
  height: ${(props: TP) => props.theme.navBarHeight};
  background: #eee;
`;

const BarContent = styled.div`
  max-width: 1280px;
  padding-left: ${(props: TP) => props.theme.appPadding};
  padding-right: ${(props: TP) => props.theme.appPadding};
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${(props: TP) => props.theme.navBarHeight};
`;

const StyledAppIcon = styled(AppIcon)`
  height: calc(${(props: TP) => props.theme.navBarHeight} - 6px);
  width: calc(${(props: TP) => props.theme.navBarHeight} - 6px);
  // width: 100%;
  // max-height: 100%;
`;

const AppBarButton = styled(IconButton)`
  height: calc(${(props: TP) => props.theme.navBarHeight} - 4px);
  max-height: 100%;
  margin-left: ${(props: TP) => props.theme.marginLR};
  margin-right: ${(props: TP) => props.theme.marginLR};
`;

const HomeLink = styled(Link)`
  font-weight: 700;
  display: flex;
  // height: 100%;
  &:link,
  &:active,
  &:visited {
    text-decoration: none;
    color: ${(props: TP) => props.theme.mainTextColor};
  }
  &:hover {
    text-decoration: none;
    opacity: 0.7;
  }
  font-size: ${(props: TP) => props.theme.fontSizeL};
`;

const StyledSearch = styled(EntitySearch)`
  flex-grow: 1;
  & > .rs__control {
    height: 100%;
  }
  margin-left: ${(props: TP) => props.theme.marginLR};
  margin-right: ${(props: TP) => props.theme.marginLR};
  padding-top: 2px;
  padding-bottom: 2px;
  height: 100%;
  width: 150px;
  min-width: 60px;
  max-width: 100%;
`;

type State = {
  searchValue: string;
};

class AppBar extends React.Component<RouteComponentProps> {
  readonly state: State = {
    searchValue: ""
  };

  onInputChange = (value: string) => {
    this.setState({ searchValue: value });
  };

  onSearch = (option: ReactSelectOption) => {
    this.setState({ searchValue: "" });
    const url = `/${ROUTES.entity}/${option.value}`;
    this.props.history.push(url);
  };

  onAddEntity = () => {
    const url = `/${ROUTES.add}/${ROUTES.entity}`;
    this.props.history.push(url);
  };

  render() {
    return (
      <Bar>
        <BarContent>
          <HomeLink to="/">
            <StyledAppIcon />
          </HomeLink>
          <StyledSearch
            onChange={this.onSearch}
            onInputChange={this.onInputChange}
            inputValue={this.state.searchValue}
            selection={null}
          />
          <AppBarButton onClick={this.onAddEntity}>
            <AddIcon />
          </AppBarButton>
        </BarContent>
      </Bar>
    );
  }
}

export default withRouter(AppBar);
