import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootStore } from "../Store";
import { RootAction } from "../utils/ACTIONS";
import ROUTES from "../utils/ROUTES";
import { Link } from "react-router-dom";

type OwnProps = {
  entityKey: string;
  baseEntityKey: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const baseEntityKey = props.baseEntityKey;
  const entityKey = props.entityKey;
  // Get the entity from the Redux Store
  const entity = state.entities.datapreview[entityKey];
  // Return everything.
  return {
    entity,
    entityKey,
    baseEntityKey
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators({}, dispatch);

class LinkedEntityPreview extends Component<Props> {
  render() {
    const { entity, entityKey, baseEntityKey } = this.props;

    return (
      <Link to={`/${ROUTES.relation}/${baseEntityKey}/${entityKey}`}>
        <li>{entity ? entity.name : `Loading ${entityKey}...`}</li>
      </Link>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinkedEntityPreview);
