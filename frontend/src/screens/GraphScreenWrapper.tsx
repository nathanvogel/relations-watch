import React, { useState } from "react";
import { RouteComponentProps, withRouter, Route, Switch } from "react-router";
import styled from "styled-components";

import DrawerLayout from "../components/layout/DrawerLayout";
import { RootStore } from "../Store";
import { bindActionCreators, AnyAction, Dispatch } from "redux";
import { connect } from "react-redux";
import RelationPreview from "../components/RelationPreview";
import EdgesListContainer from "../components/EdgesListContainer";
import HeaderModal from "../components/layout/HeaderModal";
import ROUTES from "../utils/ROUTES";
import IconButton from "../components/buttons/IconButton";
import R from "../strings/R";
import GraphLegend from "../components/graph/GraphLegend";
import { useTranslation } from "react-i18next";
import { mediaq } from "../styles/responsive-utils";
import GraphExporter from "../components/GraphExporter";

const GraphWrapper = styled.div`
  width: 100%;
  height: calc(
    100vh - ${props => props.theme.hoverBoxHeight} -
      ${props => props.theme.navBarHeight}
  );
`;

const DrawerPadder = styled.div`
  padding: ${props => props.theme.blockPadding};
  padding-top: 0.85em;

  ${mediaq.desktop} {
    margin-bottom: ${props => props.theme.hoverBoxHeight};
  }
`;

const EdgeListWrapper = styled.div`
  padding-top: 2em;
  padding-bottom: 2em;
  min-height: 30vh;
`;

interface LegendProps {
  hideColumn?: boolean;
}

const LegendColumn = styled.div<LegendProps>`
  display: ${props => (props.hideColumn ? "none" : "block")}
  position: absolute;
  right: 16px;
  left: unset;
  top: unset;
  bottom: 16px;
  height: auto;
  overflow-y: auto;
  min-width: ${props => props.theme.appMiniSidebarWidth};
  width: ${props => props.theme.appMiniSidebarWidth};
  max-height: calc(
    100vh
     - ${props => props.theme.navBarHeight}
     - ${props => props.theme.hoverBoxHeight}
     - 20px);
  padding: ${props => props.theme.blockPadding};
  box-sizing: border-box;
  // box-shadow: -15px 0px 15px 0px ${props => props.theme.sidebarBG};
  // Space for the toggle button
  padding-bottom: 44px;

  background-color: ${props => props.theme.appBG};
  opacity: 0.95;

  transition: transform 0.18s ease-out;
  transform: translateX(${props => (props.hideColumn ? "100" : "0")}%);
`;

const ToggleLegendButton = styled(IconButton)`
  position: absolute;
  bottom: 18px;
  right: 18px;
`;

interface OwnProps {
  entity1Key?: string;
  sidebarContent?: React.ReactNode;
}

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { hover } = state;
  return {
    ...props,
    hover,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({}, dispatch);

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

const GraphScreenWrapper: React.FunctionComponent<Props> = props => {
  const { hover, entity1Key } = props;
  const { t } = useTranslation();
  const [showLegend, setShowLegend] = useState(false);
  const toggleLegend = () => setShowLegend(!showLegend);
  const closeRelationDetail = () => {
    props.history.push(props.match.url);
  };

  return (
    <DrawerLayout
      drawerContent={
        <DrawerPadder>
          {props.sidebarContent}
          <GraphExporter />
        </DrawerPadder>
      }
    >
      {/* The GRAPH */}
      <GraphWrapper>{props.children}</GraphWrapper>
      {/* The LEGEND */}
      <LegendColumn hideColumn={!showLegend}>
        <GraphLegend />
      </LegendColumn>
      <ToggleLegendButton small withText onClick={toggleLegend}>
        {t(showLegend ? R.button_hide_legend : R.button_show_legend)}
      </ToggleLegendButton>
      {/* The RELATION PREVIEW */}
      <Switch>
        <Route
          path={`${props.match.url}/${ROUTES.relation}/:entity1Key/:entity2Key`}
          render={props => (
            <HeaderModal
              fullyVisible={true}
              onClose={closeRelationDetail}
              header={
                <RelationPreview
                  fullyVisible={true}
                  entity1Key={props.match.params.entity1Key}
                  entity2Key={props.match.params.entity2Key}
                />
              }
            >
              <EdgeListWrapper>
                <EdgesListContainer
                  entity1Key={props.match.params.entity1Key}
                  entity2Key={props.match.params.entity2Key}
                />
              </EdgeListWrapper>
            </HeaderModal>
          )}
        />
        <Route
          render={props => (
            <HeaderModal
              fullyVisible={false}
              onClose={closeRelationDetail}
              header={
                <RelationPreview
                  fullyVisible={false}
                  entity1Key={entity1Key || hover.relationSourceKey}
                  entity2Key={hover.relationTargetKey || hover.entityKey}
                />
              }
            />
          )}
        />
      </Switch>
    </DrawerLayout>
  );
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GraphScreenWrapper)
);
