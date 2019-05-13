import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";

import AppBar from "../components/AppBar";
import HomeScreen from "./HomeScreen";
import EntityScreen from "./EntityScreen";
import RelationsScreen from "./RelationsScreen";
import RT from "../utils/ROUTES";
import { CreateEntityScreen } from "./CreateEntityScreen";
import { getRelationId } from "../utils/utils";
import { TP } from "../utils/theme";

const MainContent = styled.main`
  width: calc(
    100% - ${(props: TP) => props.theme.appPadding}; -
      ${(props: TP) => props.theme.appPadding};
  );
  max-width: ${(props: TP) => props.theme.appMaxWidth};
  margin: 0 auto;
  padding-left: ${(props: TP) => props.theme.appPadding};
  padding-right: ${(props: TP) => props.theme.appPadding};
  padding-top: 12px;
`;

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <AppBar />
        <MainContent>
          <Switch>
            <Route
              path={`/${RT.entity}/:entityKey?`}
              component={EntityScreen}
            />
            <Route
              path={`/${RT.add}/${RT.entity}`}
              component={CreateEntityScreen}
            />
            <Route
              path={`/${RT.edit}/${RT.entity}/:entityKey?`}
              component={CreateEntityScreen}
            />
            <Route
              path={`/${RT.relation}/:entity1Key?/:entity2Key?`}
              render={props => {
                const { entity1Key, entity2Key } = props.match.params;
                return (
                  <RelationsScreen
                    {...props}
                    key={getRelationId(entity1Key, entity2Key) || undefined}
                    entity1Key={entity1Key}
                    entity2Key={entity2Key}
                  />
                );
              }}
            />
            <Route component={HomeScreen} />
          </Switch>
        </MainContent>
      </React.Fragment>
    );
  }
}

export default App;
