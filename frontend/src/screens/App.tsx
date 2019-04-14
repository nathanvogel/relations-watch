import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";

import AppBar from "../components/AppBar";
import HomeScreen from "./HomeScreen";
import EntityScreen from "./EntityScreen";
import RelationsScreen from "./RelationsScreen";
import "./App.css";
import ROUTES from "../utils/ROUTES";
import { Theme } from "../utils/media-styles";
import EntityEditor from "../components/EntityEditor";

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
              path={`/${ROUTES.entity}/:entityKey?`}
              render={props => (
                <EntityScreen {...props} key={props.match.params.entityKey} />
              )}
            />
            <Route
              path={`/${ROUTES.add}/${ROUTES.entity}`}
              render={props => <EntityEditor {...props} add={true} />}
            />
            <Route
              path={`/${ROUTES.relation}/${
                ROUTES.add
              }/:entity1Key?/:entity2Key?`}
              render={props => <RelationsScreen {...props} add={true} />}
            />
            <Route
              path={`/${ROUTES.relation}/:entity1Key?/:entity2Key?`}
              render={props => <RelationsScreen {...props} add={false} />}
            />
            <Route component={HomeScreen} />
          </Switch>
        </MainContent>
      </React.Fragment>
    );
  }
}

export default App;
