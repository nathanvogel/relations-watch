import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";

import AppBar from "../components/AppBar";
import HomeScreen from "./HomeScreen";
import EntityScreen from "./EntityScreen";
import RelationsScreen from "./RelationsScreen";
import "./App.css";
import RT from "../utils/ROUTES";
import { Theme } from "../utils/media-styles";
import { CreateEntityScreen } from "./CreateEntityScreen";
import { getRelationId } from "../utils/utils";

const MainContent = styled.main`
  width: calc(100% - ${Theme.MAIN_PADDING} - ${Theme.MAIN_PADDING});
  max-width: ${Theme.MAX_WIDTH};
  margin: 0 auto;
  padding-left: ${Theme.MAIN_PADDING};
  padding-right: ${Theme.MAIN_PADDING};
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
              render={props => <EntityScreen {...props} />}
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
