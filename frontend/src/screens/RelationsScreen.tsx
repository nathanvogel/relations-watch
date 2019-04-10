import React from "react";
import { RouteComponentProps } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";
import cuid from "cuid";

import { RootStore } from "../Store";
import ROUTES from "../utils/ROUTES";
import { getRelationId } from "../utils/utils";
import { media } from "../utils/media-styles";
import { RootAction } from "../utils/ACTIONS";
import { connect } from "react-redux";
import EntityDetails from "../components/EntityDetails";
import SearchEntity from "../components/SearchEntity";
import RelationEdgesList from "../components/RelationEdgesList";
import EdgeEditor from "../components/EdgeEditor";

const Content = styled.div`
  display: flex;
  ${media.mobile`display: block;`}
  box-sizing: border-box;
  width: 100%;
  max-width: 1440px;
  margin: auto;
  margin-top: 32px;
  padding-left: 32px;
  padding-right: 32px;
`;

const EntityColumn = styled.div`
  flex: 1;
`;
const RelationsColumn = styled.div`
  flex: 2;
  margin-left: 32px;
  margin-right: 32px;
`;

interface RelationMatch {
  entity1Key: string;
  entity2Key?: string;
  add: boolean;
}

type OwnProps = RouteComponentProps & {
  add: boolean;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const params = props.match.params as RelationMatch;
  const entity1Key = params.entity1Key;
  const entity2Key = params.entity2Key;
  const add = props.add;
  const relationId = getRelationId(entity1Key, entity2Key);

  return {
    entity1Key,
    entity2Key,
    add,
    relationId,
    history: props.history
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators({}, dispatch);

type State = {
  edgeEditorId: string;
};

class RelationsScreen extends React.Component<Props> {
  readonly state: State = {
    edgeEditorId: cuid.slug()
  };

  onSecondEntitySelected = (value: string) => {
    this.props.history.push(
      `/${ROUTES.relation}/${ROUTES.add}/${this.props.entity1Key}/${value}`
    );
  };

  render() {
    const { entity1Key, entity2Key } = this.props;

    return (
      <Content>
        <EntityColumn>
          <EntityDetails entityKey={entity1Key} />
        </EntityColumn>
        <RelationsColumn>
          {this.props.add && entity2Key ? (
            <EdgeEditor
              newEdge
              entity1Key={entity1Key}
              entity2Key={entity2Key}
              editorId={this.state.edgeEditorId}
            />
          ) : null}
          {entity2Key ? (
            <RelationEdgesList
              entity1Key={entity1Key}
              entity2Key={entity2Key}
            />
          ) : (
            <p>Select another entity to show their relationships</p>
          )}
        </RelationsColumn>
        <EntityColumn>
          {entity2Key ? (
            <EntityDetails entityKey={entity2Key} />
          ) : (
            <SearchEntity onChange={this.onSecondEntitySelected} />
          )}
        </EntityColumn>
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RelationsScreen);
