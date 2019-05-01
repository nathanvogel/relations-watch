import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { RootStore } from "../../Store";
import ROUTES from "../../utils/ROUTES";
import { bindActionCreators, Dispatch, AnyAction } from "redux";

const Content = styled.span`
  font-size: 12px;
  font-weight: bold;
  margin: 3px;
  padding: 3px;
  padding-left: 5px;
  padding-right: 5px;
  color: #fff;
  background-color: #245;
  border-radius: 2px;
  a {
    color: inherit;
    text-decoration: none;
  }
`;

type OwnProps = {
  entityKey: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const entityKey = props.entityKey;
  const entity = state.entities.datapreview[entityKey];
  return {
    entity,
    entityKey
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({}, dispatch);

/**
 * This is for a list display of the entities linked to another entity.
 * @extends Component
 */
class SourceEntityPreview extends Component<Props> {
  render() {
    const { entity, entityKey } = this.props;

    return (
      <Content>
        <Link to={`/${ROUTES.entity}/${entityKey}`}>
          {entity ? entity.name : `Loading ${entityKey}...`}
        </Link>
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceEntityPreview);
