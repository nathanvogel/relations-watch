import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import styled from "styled-components";
import cuid from "cuid";

import { RootStore } from "../Store";
import ROUTES from "../utils/ROUTES";
import { media } from "../styles/media-styles";
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
import { EditorContainerCSS } from "../components/EditorContainer";

const Content = styled.div`
  display: flex;
  ${media.mobile`display: block;`}
`;

const EntityColumn = styled.div`
  flex: 1;
`;
const RelationsColumn = styled.div`
  flex: 2;
  padding-left: 32px;
  padding-right: 32px;
`;

const AddButton = styled(IconButton)`
  ${EditorContainerCSS}
  width:100%;
  display: block;
  padding-top: ${props => props.theme.inputPaddingTB};
  padding-bottom: ${props => props.theme.inputPaddingTB};
  margin-bottom: 0px; // It's the last element
  // font-size: 6px; // smaller than the icon so that it is centered
  background-color: white;

  & > svg {
    height: 18px;
    width: 18px;
    // margin-right: 10px;
  }
`;

const ClearButton = styled(IconButton)`
  display: block;
  margin: 0 auto;
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
  const relationsStatus = relationId
    ? state.relations.status[relationId]
    : null;
  const relationsError = relationId ? state.relations.errors[relationId] : null;

  return {
    entity1Key,
    entity2Key,
    realKey1,
    realKey2,
    relationId,
    relations,
    relationsStatus,
    relationsError,
    hasBothSelection
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ loadRelation, selectEntities }, dispatch);

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

type State = {
  adding: boolean;
};

class RelationsScreen extends React.Component<Props> {
  readonly state: State = {
    adding: false
  };

  addEdgeEditorId = cuid.slug();

  componentDidMount() {
    const { realKey1, realKey2, relationsStatus } = this.props;
    if (
      realKey1 &&
      realKey2 &&
      (!relationsStatus || relationsStatus === Status.Error)
    ) {
      this.props.loadRelation(realKey1, realKey2);
      this.props.selectEntities([realKey1, realKey2]);
    }
  }

  onAddClick = () => {
    this.setState({ adding: true });
  };
  onCancelAddClick = () => {
    this.setState({ adding: false });
  };

  onEntity1Selected = (option: ReactSelectOption) => {
    const k1 = keyForUrl(option.value);
    const k2 = keyForUrl(this.props.entity2Key);
    this.props.history.push(`/${ROUTES.relation}/${k1}/${k2}`);
  };

  onEntity2Selected = (option: ReactSelectOption) => {
    const k1 = keyForUrl(this.props.entity1Key);
    const k2 = keyForUrl(option.value);
    this.props.history.push(`/${ROUTES.relation}/${k1}/${k2}`);
  };

  onEntity1Cleared = () => {
    const k1 = keyForUrl();
    const k2 = keyForUrl(this.props.entity2Key);
    this.props.history.push(`/${ROUTES.relation}/${k1}/${k2}`);
  };

  onEntity2Cleared = () => {
    const k1 = keyForUrl(this.props.entity1Key);
    const k2 = keyForUrl();
    this.props.history.push(`/${ROUTES.relation}/${k1}/${k2}`);
  };

  render() {
    const { realKey1, realKey2, hasBothSelection } = this.props;
    const { relations, relationsStatus, relationsError } = this.props;

    return (
      <Content>
        <EntityColumn>
          {realKey1 ? (
            <div>
              <EntityDetails key={realKey1} entityKey={realKey1} />
              <ClearButton small onClick={this.onEntity1Cleared}>
                Search another entity
              </ClearButton>
            </div>
          ) : (
            <EntitySearch onChange={this.onEntity1Selected} />
          )}
        </EntityColumn>
        <RelationsColumn>
          {!hasBothSelection ? (
            <p>Select another entity to show their relationships</p>
          ) : (
            <React.Fragment>
              {/* PART links preview */}
              <BigLinksPreview relations={relations} />
              {/* PART adding */}
              {this.state.adding ? (
                <EdgeEditor
                  entity1Key={realKey1}
                  entity2Key={realKey2}
                  editorId={this.addEdgeEditorId}
                  dismiss={this.onCancelAddClick}
                />
              ) : (
                <AddButton onClick={this.onAddClick}>+</AddButton>
              )}
              {/* PART edge list */}
              {relationsStatus !== Status.Ok ? (
                <Meta status={relationsStatus} error={relationsError} />
              ) : (
                <EdgesList key={this.props.relationId} relations={relations} />
              )}
            </React.Fragment>
          )}
        </RelationsColumn>
        <EntityColumn>
          {realKey2 ? (
            <div>
              <EntityDetails key={realKey2} entityKey={realKey2} />
              <ClearButton small onClick={this.onEntity2Cleared}>
                Search another entity
              </ClearButton>
            </div>
          ) : (
            <EntitySearch onChange={this.onEntity2Selected} />
          )}
        </EntityColumn>
      </Content>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RelationsScreen)
);
