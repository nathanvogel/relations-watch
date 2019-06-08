import React, { useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";

import { RootStore } from "../Store";
import { loadEntity } from "../features/entitiesLoadAC";
import { loadEntityGraph } from "../features/linksLoadAC";
import * as entitySelectionActions from "../features/entitySelectionActions";
import { withTranslation, WithTranslation } from "react-i18next";
import { Status } from "../utils/types";
import Meta from "../components/meta/Meta";
import FreeGraphContainer from "../components/graph/FreeGraphContainer";
import DrawerLayout from "../components/layout/DrawerLayout";
import History from "../components/History";
import graphSelections from "../utils/some-graph-selections";

const HistoryWrapper = styled.div`
  padding: ${props => props.theme.blockPadding};
`;

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithTranslation;

const mapStateToProps = (state: RootStore, props: RouteComponentProps) => {
  const entitySelection = graphSelections.benalla2;
  return {
    entitySelection,
    allEntities: state.entities,
    allLinks: state.links,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      loadEntity,
      loadEntityGraph,
      selectEntities: entitySelectionActions.selectEntities,
    },
    dispatch
  );

const HistoryScreen: React.FunctionComponent<Props> = props => {
  const { entitySelection, allEntities, allLinks } = props;
  // Only load if the entitySelection props change
  useEffect(() => {
    for (let key of entitySelection) {
      if (!allEntities.status[key] || allEntities.status[key] === Status.Error)
        props.loadEntity(key);
      if (!allLinks.status[key] || allLinks.status[key] === Status.Error)
        props.loadEntityGraph(key);
    }
  }, [entitySelection]);

  let loading = false;
  for (let key of entitySelection) {
    if (
      allEntities.status[key] === Status.Requested ||
      allLinks.status[key] === Status.Requested
    )
      loading = true;
    break;
  }

  // Don't unmount and mount the Graph, we keep it displayed through
  // loading phases to keep it smooth.
  return (
    <DrawerLayout
      drawerContent={
        <HistoryWrapper>
          <History editable />
        </HistoryWrapper>
      }
    >
      {loading && <Meta status={Status.Requested} />}
      <FreeGraphContainer entityKeys={entitySelection} />
    </DrawerLayout>
  );
};

export default withTranslation()(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(HistoryScreen)
  )
);
