import React from "react";
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

const DrawerPadder = styled.div`
  padding: ${props => props.theme.blockPadding};
  padding-top: 0.85em;
`;

const EdgeListWrapper = styled.div`
  padding-top: 2em;
  padding-bottom: 2em;
  min-height: 30vh;
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

  const closeRelationDetail = () => {
    props.history.push(props.match.url);
  };

  return (
    <DrawerLayout
      drawerContent={<DrawerPadder>{props.sidebarContent}</DrawerPadder>}
    >
      {props.children}
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
