import React from "react";
import styled from "styled-components";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";

import SearchEntity from "./SearchEntity";
import ROUTES from "../utils/ROUTES";
import { Theme } from "../utils/media-styles";
import Button from "./Button";

const Bar = styled.nav`
  display: block;
  height: ${Theme.NAV_HEIGHT};
  background: #eee;
`;

const BarContent = styled.div`
  max-width: 1280px;
  padding-left: ${Theme.MAIN_PADDING};
  padding-right: ${Theme.MAIN_PADDING};
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${Theme.NAV_HEIGHT};
`;

const ActionBar = styled.span``;

const HomeLink = styled(Link)`
  text-decoration: none;
  font-weight: 700;
  color: black;
  font-size: 22px;
`;

const StyledSearch = styled(SearchEntity)`
  max-width: 100px;
`;

class AppBar extends React.Component<RouteComponentProps> {
  onSearch = (entityKey: string) => {
    const url = `/${ROUTES.entity}/${entityKey}`;
    this.props.history.push(url);
  };

  render() {
    return (
      <Bar>
        <BarContent>
          <HomeLink to="/">Home</HomeLink>
          <ActionBar>
            <StyledSearch onChange={this.onSearch} />
            <Button to={`/${ROUTES.add}/${ROUTES.entity}`}>+</Button>
          </ActionBar>
        </BarContent>
      </Bar>
    );
  }
}

export default withRouter(AppBar);
