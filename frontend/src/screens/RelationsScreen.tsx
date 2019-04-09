import React from "react";
import { RouteComponentProps } from "react-router";
import styled from "styled-components";

import { RootStore } from "../Store";
import ROUTES from "../utils/ROUTES";
import { getRelationId } from "../utils/utils";
import { Relation, Status } from "../utils/types";
import { bindActionCreators, Dispatch } from "redux";
import { RootAction } from "../utils/ACTIONS";
import { connect } from "react-redux";
import Meta from "../components/Meta";
import EntityDetails from "../components/EntityDetails";
import SearchEntity from "../components/SearchEntity";

const Content = styled.div`
  width: 250px;
  max-width: calc(100% - 64px);
  margin-top: 32px;
  margin-left: 32px;
  margin-right: 32px;
`;

interface RelationMatch {
  entity1Key: string;
  entity2Key?: string;
  add: boolean;
}

type OwnProps = RouteComponentProps & {
  add: boolean;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const params = props.match.params as RelationMatch;
  const entity1Key = params.entity1Key;
  const entity2Key = params.entity2Key;
  const add = props.add;
  const relationId = getRelationId(entity1Key, entity2Key);

  // Get the entity from the Redux Store
  const relations: Relation = relationId
    ? state.relations.data[relationId]
    : {};
  const relationsStatus = relationId
    ? state.relations.status[relationId]
    : null;
  const relationsError = relationId ? state.relations.errors[relationId] : null;

  return {
    entity1Key,
    entity2Key,
    add,
    relationId,
    relations,
    relationsStatus,
    relationsError,
    history: props.history
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators({}, dispatch);

class RelationsScreen extends React.Component<Props> {
  onSecondEntitySelected = (value: string) => {
    this.props.history.push(
      `/${ROUTES.relation}/${ROUTES.add}/${this.props.entity1Key}/${value}`
    );
  };

  render() {
    const { relations, relationsStatus, relationsError } = this.props;
    const { entity1Key, entity2Key } = this.props;

    // Render loading status and error.
    // if (relationsStatus !== Status.Ok)
    //   return (
    //     <Content>
    //       <Meta status={relationsStatus} error={relationsError} />
    //     </Content>
    //   );

    return (
      <Content>
        <EntityDetails entityKey={entity1Key} />
        {entity2Key ? (
          <EntityDetails entityKey={entity2Key} />
        ) : (
          <SearchEntity onChange={this.onSecondEntitySelected} />
        )}
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RelationsScreen);
