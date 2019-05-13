import React from "react";
import styled from "styled-components";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";

import EntitySearch from "./EntitySearch";
import ROUTES from "../utils/ROUTES";
import { TP } from "../utils/theme";
import { ReactSelectOption } from "../utils/types";
import IconButton from "./buttons/IconButton";
import { ReactComponent as AddIcon } from "../assets/ic_add.svg";

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

const ActionBar = styled.span``;

const HomeLink = styled(Link)`
  font-weight: 700;
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
  & > .rs__control {
    // border-color: ${(props: TP) => props.theme.borderHover};
  }
  margin-left: ${(props: TP) => props.theme.inputLRSpacing};
  margin-right: ${(props: TP) => props.theme.inputLRSpacing};
  // height: 32px;
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
          <HomeLink to="/">Home</HomeLink>
          <ActionBar>
            <StyledSearch
              onChange={this.onSearch}
              onInputChange={this.onInputChange}
              inputValue={this.state.searchValue}
            />
            <IconButton onClick={this.onAddEntity}>
              <AddIcon />
            </IconButton>
          </ActionBar>
        </BarContent>
      </Bar>
    );
  }
}

export default withRouter(AppBar);
