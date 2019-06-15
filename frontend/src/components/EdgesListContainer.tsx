import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import styled from "styled-components";
import cuid from "cuid";
import AddIcon from "@material-ui/icons/AddCircleOutline";

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
import { MiniInfoText } from "./titles/MiniInfoText";
import ButtonBar from "./buttons/ButtonBar";

const RelationsColumn = styled.div`
  width: 100%;
  // Need to set a height for the parent to be able to scroll
  // height: 200px;
`;

const AddButton = styled(IconButton)`
  line-height: 1.4;

  & > svg {
    transform: translateY(4px);
  }
`;

type OwnProps = {
  entity1Key?: string;
  entity2Key?: string;
  className?: string;
};

// For memoization
const defaultRelations: Edge[] = [];

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { entity1Key, entity2Key, className } = props;
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
    className,
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
        <RelationsColumn className={this.props.className}>
          <MiniInfoText>
            Select two entities to display their relations.
          </MiniInfoText>
        </RelationsColumn>
      );
    }

    return (
      <RelationsColumn className={this.props.className}>
        {/* PART adding */}
        {this.state.adding ? (
          <EdgeEditor
            entity1Key={realKey1}
            entity2Key={realKey2}
            editorId={this.addEdgeEditorId}
            dismiss={this.onCancelAddClick}
          />
        ) : (
          <ButtonBar buttonsAlign="center">
            <AddButton withText onClick={this.onAddClick}>
              <AddIcon />
              Add a relation
            </AddButton>
          </ButtonBar>
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
