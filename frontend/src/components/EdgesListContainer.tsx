import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import styled from "styled-components";
import cuid from "cuid";

import { RootStore } from "../Store";
import { connect } from "react-redux";
import EdgesList from "../components/EdgesList";
import EdgeEditor from "../components/EdgeEditor";
import { emptyOrRealKey, getRelationId } from "../utils/utils";
import { Edge, Status } from "../utils/types";
import { loadRelation } from "../features/edgesLoadAC";
import Meta from "../components/meta/Meta";
import { selectEntities } from "../features/entitySelectionActions";
import IconButton from "../components/buttons/IconButton";
import { EditorContainerCSS } from "../components/layout/EditorContainer";
import { ReactComponent as AddIcon } from "../assets/ic_add.svg";
import { MiniInfoText } from "./titles/MiniInfoText";

const RelationsColumn = styled.div`
  width: 100%;
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

type OwnProps = {
  entity1Key?: string;
  entity2Key?: string;
};

// For memoization
const defaultRelations: Edge[] = [];

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
      : defaultRelations;
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
    hasBothSelection,
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

class EdgesListContainer extends React.Component<Props> {
  readonly state: State = {
    adding: false,
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

  render() {
    const { realKey1, realKey2, hasBothSelection } = this.props;
    const { relations, relationsStatus, relationsError } = this.props;

    if (!hasBothSelection) {
      return (
        <RelationsColumn>
          <MiniInfoText>
            Select two entities to display their relations.
          </MiniInfoText>
        </RelationsColumn>
      );
    }

    return (
      <RelationsColumn>
        {/* PART adding */}
        {this.state.adding ? (
          <EdgeEditor
            entity1Key={realKey1}
            entity2Key={realKey2}
            editorId={this.addEdgeEditorId}
            dismiss={this.onCancelAddClick}
          />
        ) : (
          <AddButton onClick={this.onAddClick}>
            <AddIcon />
          </AddButton>
        )}
        {/* PART edge list */}
        {relationsStatus !== Status.Ok ? (
          <Meta status={relationsStatus} error={relationsError} />
        ) : (
          <EdgesList key={this.props.relationId} relations={relations} />
        )}
      </RelationsColumn>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EdgesListContainer)
);
