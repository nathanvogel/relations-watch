import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { RootStore } from "../../Store";
import ROUTES from "../../utils/ROUTES";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import { getEntitySAsset } from "../../assets/EntityIcons";

const Content = styled.span`
  display: flex;
  align-items: center;
  flex-direction: row;

  font-size: ${props => props.theme.fontSizeS};
  // font-weight: bold;
  margin: 3px;
  padding: 3px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 2px;

  background-color: #fff;
  // color: ${props => props.theme.lightTextColor};
  // background-color: #245;
  // border-style: solid;
  // border-color: #fff;
  // border-width: ${props => props.theme.borderWidth};
  &:hover {
    background-color: ${props => props.theme.surfaceHover};
  }
`;

const StyledLink = styled(Link)`
  // font-weight: bold;

  // it's necessary to use all 3 to properly override the default value
  // in Firefox 66.0.5 Windows.
  // (or we can also use a nested span)
  &:link,
  &:active,
  &:visited {
    text-decoration: none;
    color: ${props => props.theme.mainTextColor};
  }
  &:hover {
    text-decoration: underline;
  }
`;

const EntityImage = styled.img`
  height: 16px;
  padding-right: 4px;
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
      <StyledLink to={`/${ROUTES.entity}/${entityKey}`}>
        {!entity ? (
          <Content>{`Loading ${entityKey}...`}</Content>
        ) : (
          <Content>
            <EntityImage src={getEntitySAsset(entity.type)} />
            {entity.name}
          </Content>
        )}
      </StyledLink>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceEntityPreview);
