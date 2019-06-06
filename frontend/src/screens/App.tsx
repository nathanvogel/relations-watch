import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import AppBar from "../components/AppBar";
import HomeScreen from "./HomeScreen";
import EntityScreen from "./EntityScreen";
import RelationsScreen from "./RelationsScreen";
import RT from "../utils/ROUTES";
import { CreateEntityScreen } from "./CreateEntityScreen";
import { getRelationId } from "../utils/utils";
import Importer from "../components/Importer";
import { Entity } from "../utils/types";
import styled from "styled-components";
import { PageWidthSizer, PagePadder } from "../styles/sizers";
import HistoryScreen from "./HistoryScreen";

const PageContent = styled.div`
  ${PageWidthSizer}
  ${PagePadder}
`;

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path={`/${RT.entity}/:entityKey?`} component={EntityScreen} />
          <Route
            path={`/${RT.import}/:datasetId/:entityDatasetId`}
            render={props => {
              const { datasetId, entityDatasetId } = props.match.params;
              return (
                <React.Fragment>
                  <AppBar />
                  <PageContent>
                    <Importer
                      key={datasetId + ":" + entityDatasetId}
                      datasetId={datasetId}
                      entityDatasetId={entityDatasetId}
                      onDone={(newEntity: Entity | undefined) => {
                        if (newEntity)
                          props.history.push(`/${RT.entity}/${newEntity._key}`);
                      }}
                    />
                  </PageContent>
                </React.Fragment>
              );
            }}
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
                <React.Fragment>
                  <AppBar />
                  <RelationsScreen
                    {...props}
                    key={getRelationId(entity1Key, entity2Key) || undefined}
                    entity1Key={entity1Key}
                    entity2Key={entity2Key}
                  />
                </React.Fragment>
              );
            }}
          />
          <Route path={`/history`} component={HistoryScreen} />
          <Route component={HomeScreen} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
