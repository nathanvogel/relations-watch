import React from "react";
import styled from "styled-components";

import { Edge } from "../utils/types";
import Button from "./Button";
import EdgeEditor from "./EdgeEditor";

const Content = styled.section`
  border: 1px dotted ${props => props.color};
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
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
    return this.state.editing ? (
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
          editorId={edge._key || "theid"}
        />
      </div>
    ) : (
      <Content>
        <Actions>
          <Button onClick={this.onEditClick}>Edit</Button>
        </Actions>
        <p>{edge.text}</p>
      </Content>
    );
  }
}

export default EdgeDetails;
