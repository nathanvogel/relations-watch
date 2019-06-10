import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import styled, { css } from "styled-components";

import { RootStore } from "../Store";
import ROUTES from "../utils/ROUTES";
import { media } from "../styles/responsive-utils";
import { connect } from "react-redux";
import EntityDetails from "../components/EntityDetails";
import EntitySearch from "../components/EntitySearch";
import { emptyOrRealKey, keyForUrl, getRelationId } from "../utils/utils";
import { Edge, EntitySelectOption } from "../utils/types";
import { loadRelation } from "../features/edgesLoadAC";
import BigLinksPreview from "../components/BigLinksPreview";
import { selectEntities } from "../features/entitySelectionActions";

const limitedContainerCSS = css`
  max-height: 100%;
  overflow: hidden;
`;

interface ContainerProps {
  fullyVisible: boolean;
}
const Container = styled.div<ContainerProps>`
  ${props => (props.fullyVisible ? "" : limitedContainerCSS)}

  display: flex;
  ${media.mobile`display: block;`}
`;

const EntityColumn = styled.div`
  flex: 1;
`;
const LinksColumn = styled.div`
  flex-grow: 1;
`;

type OwnProps = {
  entity1Key?: string;
  entity2Key?: string;
  fullyVisible: boolean;
};

// For memoization
const defaultRelations: Edge[] = [];

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { entity1Key, entity2Key, fullyVisible } = props;
  const realKey1 = emptyOrRealKey(entity1Key);
  const realKey2 = emptyOrRealKey(entity2Key);
  const hasBothSelection = Boolean(realKey1) && Boolean(realKey2);
  const relationId = getRelationId(realKey1, realKey2) as string;

  // Get the relation from the Redux Store
  const relations: Edge[] =
    relationId && state.relations.data[relationId]
      ? state.relations.data[relationId]
      : defaultRelations;

  return {
    realKey1,
    realKey2,
    relations,
    hasBothSelection,
    fullyVisible,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ loadRelation, selectEntities }, dispatch);

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

class RelationPreview extends React.PureComponent<Props> {
  onEntity1Selected = (option: EntitySelectOption) => {
    const k1 = keyForUrl(option.value);
    const k2 = keyForUrl(this.props.realKey2);
    this.props.history.push(
      `${this.props.match.url}/${ROUTES.relation}/${k1}/${k2}`
    );
  };

  onEntity2Selected = (option: EntitySelectOption) => {
    const k1 = keyForUrl(this.props.realKey1);
    const k2 = keyForUrl(option.value);
    this.props.history.push(
      `${this.props.match.url}/${ROUTES.relation}/${k1}/${k2}`
    );
  };

  onEntity1Cleared = () => {
    const k1 = keyForUrl();
    const k2 = keyForUrl(this.props.realKey2);
    this.props.history.push(
      `${this.props.match.url}/${ROUTES.relation}/${k1}/${k2}`
    );
  };

  onEntity2Cleared = () => {
    const k1 = keyForUrl(this.props.realKey1);
    const k2 = keyForUrl();
    this.props.history.push(
      `${this.props.match.url}/${ROUTES.relation}/${k1}/${k2}`
    );
  };

  render() {
    const { realKey1, realKey2, fullyVisible } = this.props;
    const { relations } = this.props;

    return (
      <Container fullyVisible={fullyVisible}>
        <EntityColumn>
          {realKey1 ? (
            <div>
              <EntityDetails key={realKey1} entityKey={realKey1} />
            </div>
          ) : (
            <EntitySearch
              placeholder="Search another..."
              onChange={this.onEntity1Selected}
            />
          )}
        </EntityColumn>
        <LinksColumn>
          {/* PART links preview */}
          <BigLinksPreview relations={relations} />
        </LinksColumn>
        <EntityColumn>
          {realKey2 ? (
            <div style={{ textAlign: "right" }}>
              <EntityDetails key={realKey2} entityKey={realKey2} />
            </div>
          ) : (
            <EntitySearch
              placeholder="Search another..."
              onChange={this.onEntity2Selected}
            />
          )}
        </EntityColumn>
      </Container>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RelationPreview)
);
