import React from "react";
import styled from "styled-components";

import { Edge, Status } from "../utils/types";
import EdgeEditor from "./EdgeEditor";
import { RELATION_COLORS, TP } from "../utils/theme";
import SourceDetails from "./SourceDetails";
import EdgeSummary from "./edgeDetails/EdgeSummary";
import { RootStore } from "../Store";
import { Dispatch, AnyAction, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ReactComponent as EditIcon } from "../assets/ic_edit.svg";
import SourceListItemContainerCSS from "./sourceDetails/SourceListItemContainer";
import IconButton from "./buttons/IconButton";

const Content = styled.section`
  box-sizing: border-box;
  border-color: ${(props: TP) => props.theme.inputBG};
  border-width: ${(props: TP) => props.theme.borderWidth};
  border-style: solid;
  border-radius: ${(props: TP) => props.theme.radius};

  transition: border-color 0.1s ease-in-out;

  &:hover {
    border-color: ${props => props.color}dd;
  }

  // background-color: #f4f4f4;
  padding: ${(props: TP) => props.theme.blockPadding};
  margin-top: ${(props: TP) => props.theme.blockSpacingTB};
  margin-bottom: ${(props: TP) => props.theme.blockSpacingTB};
`;

const EdgeMainText = styled.p`
  font-size: 24px;
  margin-top: 24px;
  margin-bottom: 20px;
`;

const AddSourceButton = styled(IconButton)`
  ${SourceListItemContainerCSS}
  width: 100%;
  display: block;
  padding-top: ${(props: TP) => props.theme.inputPaddingTB};
  padding-bottom: ${(props: TP) => props.theme.inputPaddingTB};
  margin-bottom: 0px; // It's the last element
  font-size: 6px; // smaller than the icon so that it is centered
  // background-color: white;

  & > svg {
    height: 18px;
    width: 18px;
    // margin-right: 10px;
  }
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
            edge={edge}
            entityFrom={entityFrom}
            entityTo={entityTo}
          />
        )}
        <EdgeMainText>{edge.text}</EdgeMainText>
        {edge.sourceText && (!edge.sources || edge.sources.length === 0) && (
          <div>Previous source: {edge.sourceText}</div>
        )}
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
        <AddSourceButton onClick={this.onEditClick}>
          <EditIcon />
        </AddSourceButton>
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EdgeDetails);
