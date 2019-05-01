import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootStore } from "../Store";
import { Status } from "../utils/types";
import { RootAction } from "../utils/ACTIONS";

type OwnProps = { entityKey: string };

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const entityKey = props.entityKey;
  // Get the entity from the Redux Store
  const entity = state.entities.data[entityKey];
  const status = state.entities.status[entityKey];
  // Return everything.
  return {
    entity,
    status
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators({}, dispatch);

class EntityName extends Component<Props> {
  render() {
    const { entity, status } = this.props;
    if (status !== Status.Ok) return <span>...</span>;

    return <span>{entity ? entity.name : ""}</span>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityName);
