import React, { Component } from "react";
import { RouterProps } from "react-router";
import styled from "styled-components";

import SearchEntity from "../components/SearchEntity";
import ROUTES from "../utils/ROUTES";

const Header = styled.header`
  margin-top: 20vh;
`;

const CentralSearch = styled(SearchEntity)`
  font-size: 22px;
  display: block;
  width: 330px;
  max-width: 100%;
  margin: 0 auto;
`;

const CentralTitle = styled.h2`
  text-align: center;
  font-size: 24px;
`;

class HomeScreen extends Component<RouterProps> {
  onSearch = (entityKey: string) => {
    const url = `/${ROUTES.entity}/${entityKey}`;
    this.props.history.push(url);
  };

  render() {
    return (
      <Header>
        <CentralTitle>Explore the relation graph</CentralTitle>
        <CentralSearch onChange={this.onSearch} />
      </Header>
    );
  }
}

export default HomeScreen;
