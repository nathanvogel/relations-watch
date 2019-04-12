import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootStore } from "../Store";
import { Status, EdgePreview } from "../utils/types";
import { RootAction } from "../utils/ACTIONS";
import ROUTES from "../utils/ROUTES";
import { Link } from "react-router-dom";

type OwnProps = {
  linkData: EdgePreview;
  baseEntityKey: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const baseEntityKey = props.baseEntityKey;
  const linkData = props.linkData;
  const thisEntityKey =
    props.linkData._to === baseEntityKey
      ? props.linkData._from
      : props.linkData._to;
  // Get the entity from the Redux Store
  // TODO : will change to custom loading of a subset of attributes.
  const entity = state.entities.data[thisEntityKey];
  const status = state.entities.status[thisEntityKey];
  // Return everything.
  return {
    entity,
    status,
    thisEntityKey,
    baseEntityKey,
    linkData
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators({}, dispatch);

class LinkedEntityPreview extends Component<Props> {
  render() {
    const { entity, status, thisEntityKey, baseEntityKey } = this.props;

    if (status !== Status.Ok)
      return (
        <Link to={`/${ROUTES.relation}/${baseEntityKey}/${thisEntityKey}`}>
          <li>{thisEntityKey}</li>
        </Link>
      );

    return (
      <Link to={`/${ROUTES.relation}/${baseEntityKey}/${thisEntityKey}`}>
        <li>{entity ? entity.name : ""}</li>
      </Link>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinkedEntityPreview);
