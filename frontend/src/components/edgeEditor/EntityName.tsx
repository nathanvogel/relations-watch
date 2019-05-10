import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import styled from "styled-components";

import { RootStore } from "../../Store";
import { Status } from "../../utils/types";

const Name = styled.span`
  font-weight: bold;
`;

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

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({}, dispatch);

class EntityName extends Component<Props> {
  render() {
    const { entity, status } = this.props;
    if (status !== Status.Ok) return <Name>...</Name>;

    return <Name>{entity ? entity.name : ""}</Name>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityName);
