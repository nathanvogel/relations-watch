import React from "react";

import { Edge } from "../utils/types";
import Button from "./Button";
import EdgeEditor from "./EdgeEditor";

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
        <EdgeEditor
          key={edge._key}
          edgeKey={edge._key}
          entity1Key={edge._from}
          entity2Key={edge._to}
          dismiss={this.onDoneEditing}
          editorId={edge._key || "theid"}
        />
        <Button onClick={this.onDoneEditing}>Cancel</Button>
      </div>
    ) : (
      <div>
        {edge.text} <Button onClick={this.onEditClick}>Edit</Button>
      </div>
    );
  }
}

export default EdgeDetails;
