import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";
import cuid from "cuid";

import { RootStore } from "../Store";
import ROUTES from "../utils/ROUTES";
import { media } from "../utils/media-styles";
import { RootAction } from "../utils/ACTIONS";
import { connect } from "react-redux";
import EntityDetails from "../components/EntityDetails";
import SearchEntity from "../components/SearchEntity";
import RelationEdgesList from "../components/RelationEdgesList";
import EdgeEditor from "../components/EdgeEditor";
import Button from "../components/Button";
import { emptyOrRealKey, keyForUrl, getRelationId } from "../utils/utils";

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

  return {
    entity1Key,
    entity2Key,
    realKey1,
    realKey2,
    relationId,
    hasBothSelection
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators({}, dispatch);

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

type State = {
  addEdgeEditorId: string;
  adding: boolean;
};

class RelationsScreen extends React.Component<Props> {
  readonly state: State = {
    addEdgeEditorId: cuid.slug(),
    adding: false
  };

  onAddClick = () => {
    this.setState({ adding: true });
  };
  onCancelAddClick = () => {
    this.setState({ adding: false });
  };

  onEntity1Selected = (entity1Key: string) => {
    const k1 = keyForUrl(entity1Key);
    const k2 = keyForUrl(this.props.entity2Key);
    this.props.history.push(`/${ROUTES.relation}/${k1}/${k2}`);
  };

  onEntity2Selected = (entity2Key: string) => {
    const k1 = keyForUrl(this.props.entity1Key);
    const k2 = keyForUrl(entity2Key);
    this.props.history.push(`/${ROUTES.relation}/${k1}/${k2}`);
  };

  render() {
    const { entity1Key, entity2Key } = this.props;
    const { realKey1, realKey2, hasBothSelection } = this.props;

    return (
      <Content>
        <EntityColumn>
          {realKey1 ? (
            <div>
              <EntityDetails key={realKey1} entityKey={realKey1} />
              <Button onClick={this.onEntity1Selected.bind(this, "")}>
                Clear
              </Button>
            </div>
          ) : (
            <SearchEntity onChange={this.onEntity1Selected} />
          )}
        </EntityColumn>
        <RelationsColumn>
          {hasBothSelection &&
            (this.state.adding ? (
              <React.Fragment>
                <EdgeEditor
                  entity1Key={realKey1}
                  entity2Key={realKey2}
                  editorId={this.state.addEdgeEditorId}
                  dismiss={this.onCancelAddClick}
                />
                <Button onClick={this.onCancelAddClick}>Cancel</Button>
              </React.Fragment>
            ) : (
              <Button onClick={this.onAddClick}>Add a relation element</Button>
            ))}
          {hasBothSelection ? (
            <RelationEdgesList
              key={this.props.relationId}
              entity1Key={realKey1}
              entity2Key={realKey2}
            />
          ) : (
            <p>Select another entity to show their relationships</p>
          )}
        </RelationsColumn>
        <EntityColumn>
          {realKey2 ? (
            <div>
              <EntityDetails key={realKey2} entityKey={realKey2} />
              <Button onClick={this.onEntity2Selected.bind(this, "")}>
                Clear
              </Button>
            </div>
          ) : (
            <SearchEntity onChange={this.onEntity2Selected} />
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
