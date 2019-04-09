import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import HomeScreen from "./HomeScreen";
import EntityScreen from "./EntityScreen";
import RelationsScreen from "./RelationsScreen";
import "./App.css";
import ROUTES from "../utils/ROUTES";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route
          path={`/${ROUTES.entity}/:entityKey?`}
          component={EntityScreen}
        />
        <Route
          path={`/${ROUTES.relation}/${ROUTES.add}/:entity1Key?/:entity2Key?`}
          render={props => <RelationsScreen {...props} add={true} />}
        />
        <Route
          path={`/${ROUTES.relation}/:entity1Key?/:entity2Key?`}
          render={props => <RelationsScreen {...props} add={false} />}
        />
        <Route component={HomeScreen} />
      </Switch>
    );
  }
}

export default App;
