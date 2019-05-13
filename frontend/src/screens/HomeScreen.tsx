import React, { Component } from "react";
import { RouterProps } from "react-router";
import styled from "styled-components";

import EntitySearch from "../components/EntitySearch";
import ROUTES from "../utils/ROUTES";
import { ReactSelectOption } from "../utils/types";
import { TP } from "../utils/theme";

const Header = styled.header`
  margin-top: 16vh;
`;

const CentralSearch = styled(EntitySearch)`
  font-size: 22px;
  display: block;
  width: 330px;
  max-width: 100%;
  margin: 0 auto;

  .rs__control {
    padding: 4px ${(props: TP) => props.theme.inputPaddingLR};
  }
`;

const CentralTitle = styled.h2`
  text-align: center;
  font-size: 24px;
`;

class HomeScreen extends Component<RouterProps> {
  onSearch = (searchSelection: ReactSelectOption) => {
    const entityKey = searchSelection.value;
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
