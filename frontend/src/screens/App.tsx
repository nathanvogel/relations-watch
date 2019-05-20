import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import AppBar from "../components/AppBar";
import HomeScreen from "./HomeScreen";
import EntityScreen from "./EntityScreen";
import RelationsScreen from "./RelationsScreen";
import RT from "../utils/ROUTES";
import { CreateEntityScreen } from "./CreateEntityScreen";
import { getRelationId } from "../utils/utils";
import ImportScreen from "./ImportScreen";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <AppBar />
        <Switch>
          <Route path={`/${RT.entity}/:entityKey?`} component={EntityScreen} />
          <Route
            path={`/${RT.add}/${RT.entity}`}
            component={CreateEntityScreen}
          />
          <Route
            path={`/${RT.import}/:datasetId/:entityDatasetId`}
            component={ImportScreen}
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
      </React.Fragment>
    );
  }
}

export default App;
