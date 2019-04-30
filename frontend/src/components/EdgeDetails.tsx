import React from "react";
import styled from "styled-components";

import { Edge } from "../utils/types";
import Button from "./Button";
import EdgeEditor from "./EdgeEditor";
import Sources from "./Sources";
import { RELATION_COLORS } from "../utils/consts";

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

const Actions = styled.div`
  float: right;
`;

type Props = {
  edge: Edge;
};

type State = {
  editing: boolean;
};

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
    const { edge } = this.props;
    if (!edge._key) return <Content>Error: missing _key attribute.</Content>;

    if (this.state.editing)
      return (
        <div>
          <Actions>
            <Button onClick={this.onDoneEditing}>Cancel</Button>
          </Actions>
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
        <Actions>
          <Button onClick={this.onEditClick}>Edit</Button>
        </Actions>
        <EdgeText>{edge.text}</EdgeText>
        <Sources
          confirmSources={edge.sourceText ? [edge.sourceText] : []}
          refuteSources={[]}
        />
      </Content>
    );
  }
}

export default EdgeDetails;
