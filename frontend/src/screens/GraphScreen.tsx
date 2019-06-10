import React from "react";
import { RouteComponentProps, withRouter, Route, Switch } from "react-router";
import styled from "styled-components";

import Meta from "../components/meta/Meta";
import DrawerLayout from "../components/layout/DrawerLayout";
import { RootStore } from "../Store";
import { bindActionCreators, AnyAction, Dispatch } from "redux";
import { connect } from "react-redux";
import RelationPreview from "../components/RelationPreview";
import EdgesListContainer from "../components/EdgesListContainer";
import HeaderModal from "../components/layout/HeaderModal";
import ROUTES from "../utils/ROUTES";

const StyledMeta = styled(Meta)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(20vh);
`;

const DrawerPadder = styled.div`
  padding: ${props => props.theme.blockPadding};
  padding-top: 0.85em;
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

const GraphScreen: React.FunctionComponent<Props> = props => {
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
              <EdgesListContainer
                entity1Key={props.match.params.entity1Key}
                entity2Key={props.match.params.entity2Key}
              />
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
  )(GraphScreen)
);
