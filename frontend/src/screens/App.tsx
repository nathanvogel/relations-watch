import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import AppBar from "../components/AppBar";
import HomeScreen from "./HomeScreen";
import EntityScreen from "./EntityScreen";
import History from "../components/History";
import RT from "../utils/ROUTES";
import { CreateEntityScreen } from "./CreateEntityScreen";
import Importer from "../components/Importer";
import { Entity } from "../utils/types";
import styled from "styled-components";
import { PageWidthSizer, PagePadder } from "../styles/sizers";
import HistoryScreen from "./HistoryScreen";
import GraphScreenWrapper from "./GraphScreenWrapper";
import SavedGraphScreen from "./SavedGraphScreen";
import SecondaryTitle from "../components/titles/SecondaryTitle";
import LinkSharer from "../components/LinkSharer";

const PageContent = styled.div`
  ${PageWidthSizer}
  ${PagePadder}
`;

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route
            path={`/${RT.entity}/:entityKey`}
            render={props => (
              <GraphScreenWrapper
                entity1Key={props.match.params.entityKey}
                sidebarContent={<History editable={false} />}
              >
                <EntityScreen entityKey={props.match.params.entityKey} />
              </GraphScreenWrapper>
            )}
          />
          <Route
            path={`/history`}
            render={props => (
              <GraphScreenWrapper sidebarContent={<History editable={true} />}>
                <HistoryScreen />
              </GraphScreenWrapper>
            )}
          />
          <Route
            path={`/${RT.graph}/:graphKey`}
            render={props => (
              <GraphScreenWrapper
                sidebarContent={
                  <div>
                    <p>
                      <strong>relations.</strong>watch is a collaborative
                      platform to gather knowledge about relations between
                      public figures, companies, medias, etc.
                    </p>
                    {/* <SecondaryTitle>Network</SecondaryTitle> */}
                    <LinkSharer link={window.location.href}>
                      Share this link to show this graph to anyone:
                    </LinkSharer>
                  </div>
                }
              >
                <SavedGraphScreen graphKey={props.match.params.graphKey} />
              </GraphScreenWrapper>
            )}
          />
          <Redirect
            from={`/${RT.relation}/:entity1Key/:entity2Key`}
            to={`/${RT.entity}/:entity1Key/${
              RT.relation
            }/:entity1Key/:entity2Key`}
          />
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
          <Route component={HomeScreen} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
