import React, { Component } from "react";
import { RouterProps } from "react-router";
import styled from "styled-components";

import Button from "../components/Button";
import SearchEntity from "../components/SearchEntity";
import ROUTES from "../utils/ROUTES";

const CentralSearch = styled(SearchEntity)`
  font-size: 22px;
  width: 330px;
  max-width: 100%;
  display: block;
  margin: 20px auto;
`;

const Header = styled.header`
  width: 960px;
  max-width: calc(100% - 64px);
  margin-top: 20vh;
  margin-left: 32px;
  margin-right: 32px;
`;

const CentralTitle = styled.h2`
  width: 100%;
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
