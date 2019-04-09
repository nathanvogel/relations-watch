import React from "react";
import { RouteComponentProps } from "react-router";

import { RootStore } from "../Store";
import ROUTES from "../utils/ROUTES";
import { getRelationId } from "../utils/utils";
import { Relation } from "../utils/types";
import { bindActionCreators, Dispatch } from "redux";
import { RootAction } from "../utils/ACTIONS";
import { connect } from "react-redux";

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
    relationsError
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators({}, dispatch);

class RelationsScreen extends React.Component<OwnProps> {
  render() {
    console.log("do add:", this.props.add);
    return <p>Relations</p>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RelationsScreen);
