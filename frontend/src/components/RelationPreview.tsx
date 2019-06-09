import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import styled from "styled-components";
import cuid from "cuid";

import { RootStore } from "../Store";
import ROUTES from "../utils/ROUTES";
import { media } from "../styles/responsive-utils";
import { connect } from "react-redux";
import EntityDetails from "../components/EntityDetails";
import EntitySearch from "../components/EntitySearch";
import EdgesList from "../components/EdgesList";
import EdgeEditor from "../components/EdgeEditor";
import { emptyOrRealKey, keyForUrl, getRelationId } from "../utils/utils";
import { Edge, Status, ReactSelectOption } from "../utils/types";
import { loadRelation } from "../features/edgesLoadAC";
import Meta from "../components/meta/Meta";
import BigLinksPreview from "../components/BigLinksPreview";
import { selectEntities } from "../features/entitySelectionActions";
import IconButton from "../components/buttons/IconButton";
import { EditorContainerCSS } from "../components/layout/EditorContainer";
import { PageWidthSizer, PagePadder } from "../styles/sizers";
import { ReactComponent as SearchIcon } from "../assets/ic_search.svg";
import { ReactComponent as AddIcon } from "../assets/ic_add.svg";

const Header = styled.div`
  display: flex;
  ${media.mobile`display: block;`}
`;

const EntityColumn = styled.div`
  flex: 1;
  width: 100%;
  max-width: 220px;
`;
const LinksColumn = styled.div`
  flex-grow: 1;
`;

const ClearButton = styled(IconButton)`
  display: inline-block;
  margin: ${props => props.theme.inputMarginTB} 0;
`;

type OwnProps = {
  entity1Key?: string;
  entity2Key?: string;
};

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { entity1Key, entity2Key } = props;
  const realKey1 = emptyOrRealKey(entity1Key);
  const realKey2 = emptyOrRealKey(entity2Key);
  const hasBothSelection = Boolean(realKey1) && Boolean(realKey2);
  const relationId = getRelationId(realKey1, realKey2) as string;

  // Get the relation from the Redux Store
  const relations: Edge[] =
    relationId && state.relations.data[relationId]
      ? state.relations.data[relationId]
      : [];

  return {
    realKey1,
    realKey2,
    relations,
    hasBothSelection,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ loadRelation, selectEntities }, dispatch);

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

class RelationPreview extends React.Component<Props> {
  onEntity1Selected = (option: ReactSelectOption) => {
    const k1 = keyForUrl(option.value);
    const k2 = keyForUrl(this.props.realKey2);
    this.props.history.push(
      `${this.props.match.url}/${ROUTES.relation}/${k1}/${k2}`
    );
  };

  onEntity2Selected = (option: ReactSelectOption) => {
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
    const { realKey1, realKey2, hasBothSelection } = this.props;
    const { relations } = this.props;

    return (
      <Header>
        <EntityColumn>
          {realKey1 ? (
            <div>
              <EntityDetails key={realKey1} entityKey={realKey1} />
              <ClearButton withText small onClick={this.onEntity1Cleared}>
                <SearchIcon />
                Search
              </ClearButton>
            </div>
          ) : (
            <EntitySearch onChange={this.onEntity1Selected} />
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
              <ClearButton withText small onClick={this.onEntity2Cleared}>
                <SearchIcon />
                Search
              </ClearButton>
            </div>
          ) : (
            <EntitySearch onChange={this.onEntity2Selected} />
          )}
        </EntityColumn>
      </Header>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RelationPreview)
);
