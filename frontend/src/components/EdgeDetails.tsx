import React from "react";
import styled from "styled-components";

import { Edge, Entity, Status } from "../utils/types";
import Button from "./buttons/Button";
import EdgeEditor from "./EdgeEditor";
import { RELATION_COLORS } from "../utils/consts";
import SourceDetails from "./SourceDetails";
import EdgeSummary from "./edgeDetails/EdgeSummary";
import { RootStore } from "../Store";
import { Dispatch, AnyAction, bindActionCreators } from "redux";
import { connect } from "react-redux";

const Content = styled.section`
  border: 1px dotted black;
  border-bottom: 4px solid ${props => props.color}33;
  &:hover {
    border-bottom: 4px solid ${props => props.color}dd;
  }
  // background-color: #f4f4f4;
  padding: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const EdgeText = styled.p`
  font-size: 16px;
  margin-top: 0px;
`;

const BottomActions = styled.div`
  text-align: center;
`;

type OwnProps = {
  edge: Edge;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  editing: boolean;
};

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { edge } = props;
  const entityFrom = state.entities.data[props.edge._from];
  const statusFrom = state.entities.status[props.edge._from];
  const entityTo = state.entities.data[props.edge._to];
  const statusTo = state.entities.status[props.edge._to];

  const hasLoadedEntities = statusFrom === Status.Ok && statusTo === Status.Ok;

  return {
    edge,
    entityFrom,
    entityTo,
    hasLoadedEntities
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({}, dispatch);

class EdgeDetails extends React.Component<Props> {
  readonly state: State = {
    editing: false
  };

  onEditClick = () => {
    this.setState({ editing: true });
  };

  onDoneEditing = () => {
    this.setState({ editing: false });
  };

  render() {
    const { edge, entityFrom, entityTo } = this.props;
    if (!edge._key) return <Content>Error: missing _key attribute.</Content>;

    if (this.state.editing)
      return (
        <div>
          <EdgeEditor
            key={edge._key}
            edgeKey={edge._key}
            entity1Key={edge._from}
            entity2Key={edge._to}
            dismiss={this.onDoneEditing}
            editorId={edge._key}
          />
        </div>
      );

    return (
      <Content color={RELATION_COLORS[edge.type]}>
        {this.props.hasLoadedEntities && (
          <EdgeSummary
            relationType={edge.type}
            entityFrom={entityFrom}
            entityTo={entityTo}
          />
        )}
        <EdgeText>{edge.text}</EdgeText>
        {edge.sourceText && <div>Previous source: {edge.sourceText}</div>}
        {edge.sources && edge.sources.length > 0 ? (
          edge.sources.map((sourceLink, index) => (
            <SourceDetails
              key={sourceLink.sourceKey}
              sourceKey={sourceLink.sourceKey || "MISSING_SOURCE_KEY"}
              sourceLink={sourceLink}
            />
          ))
        ) : (
          <div>
            <em>UNSOURCED INFORMATION</em>
          </div>
        )}
        <BottomActions>
          <Button onClick={this.onEditClick}>Add a source and/or edit</Button>
        </BottomActions>
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EdgeDetails);
