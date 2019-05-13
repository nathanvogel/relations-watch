import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { RootStore } from "../../Store";
import ROUTES from "../../utils/ROUTES";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import { getEntitySAsset } from "../../assets/EntityIcons";
import { TP } from "../../utils/theme";

const Content = styled.span`
  display: flex;
  align-items: center;
  flex-direction: row;

  font-size: ${(props: TP) => props.theme.fontSizeS};
  // font-weight: bold;
  margin: 3px;
  padding: 3px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 2px;

  background-color: #fff;
  // color: ${(props: TP) => props.theme.lightTextColor};
  // background-color: #245;
  // border-style: solid;
  // border-color: #fff;
  // border-width: ${(props: TP) => props.theme.borderWidth};
  &:hover {
    background-color: ${(props: TP) => props.theme.surfaceHover};
  }
`;

const StyledLink = styled(Link)`
  font-weight: bold;
  text-decoration: none;
  &:link {
    color: ${(props: TP) => props.theme.mainTextColor};
  }
`;

const NameSpan = styled.span`
  // This is only to fix a bug in Firefox 66.0.5 Windows,
  // with which even if the correct style override is choosen in the inspector,
  // Firefox renders the other color.
  color: ${(props: TP) => props.theme.mainTextColor};
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
            <NameSpan>{entity.name}</NameSpan>
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
