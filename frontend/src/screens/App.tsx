import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import HomeScreen from "./HomeScreen";
import "./App.css";
import ROUTES from "../utils/ROUTES";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route
          path={`/${ROUTES.entity}/:entityKey?`}
          render={() => <h1>Hey</h1>}
        />
        <Route component={HomeScreen} />
      </Switch>
    );
  }
}

export default App;
