import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import styled from "styled-components";

import Button from "../components/Button";
import ROUTES from "../utils/ROUTES";

const Content = styled.div`
  width: 960px;
  max-width: calc(100% - 64px);
  margin-top: 32px;
  margin-left: 32px;
  margin-right: 32px;
  // box-sizing: border-box;
`;

const PersonName = styled.h2`
  text-align: left;
  font-size: 24px;
`;

export interface EntityMatch {
  entityKey: string;
}

class EntityScreen extends Component<RouteComponentProps> {
  componentDidMount() {
    const params = this.props.match.params as EntityMatch;
    const key: string = params["entityKey"];
    if (key) console.log("props", this.props);
  }

  render() {
    return (
      <Content>
        <PersonName>loading...</PersonName>
        <Button to={`/${ROUTES.relation}/${ROUTES.new}`}>New relation</Button>
      </Content>
    );
  }
}

export default EntityScreen;
