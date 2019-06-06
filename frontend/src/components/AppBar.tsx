import React from "react";
import styled from "styled-components";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";

import EntitySearch from "./EntitySearch";
import ROUTES from "../utils/ROUTES";
import { ReactSelectOption } from "../utils/types";

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
  padding-left: ${props => props.theme.appPaddingLR};
  padding-right: ${props => props.theme.appPaddingLR};
`;

// const AppBarButton = styled(IconButton)`
//   height: calc(${props => props.theme.navBarHeight} - 4px);
//   max-height: 100%;
//   margin-left: ${props => props.theme.marginLR};
//   margin-right: ${props => props.theme.marginLR};
// `;

const StyledSearch = styled(EntitySearch)`
  flex-grow: 1;
  & > .rs__control {
    height: 100%;
  }
  // margin-left: ${props => props.theme.marginLR};
  // margin-right: ${props => props.theme.marginLR};
  padding-top: 6px;
  padding-bottom: 6px;
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
