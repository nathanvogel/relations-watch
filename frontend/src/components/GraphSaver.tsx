import React from "react";
import { Status, SavedGraphEntity, SavedGraph } from "../utils/types";
import api from "../utils/api";
import IconButton from "./buttons/IconButton";
import Meta from "./meta/Meta";
import ROUTES from "../utils/ROUTES";
import BreakableA from "./buttons/BreakableA";

const saveGraph = async (selection: string[]): Promise<string | null> => {
  if (!selection || selection.length <= 0) {
    console.error("No selection was provided.");
    return null;
  }

  const entities: Array<SavedGraphEntity> = [];
  for (let entityKey of selection) {
    entities.push({ entityKey });
  }
  const data: SavedGraph = { entities };
  const response = await api.post("/graphs", data);
  if (response.status === 200) {
    return response.data._key;
  } else {
    console.error("Error" + response.status + " while saving graph ");
    console.error(response);
    return null;
  }
};

type Props = {
  selection: string[];
};

class GraphSaver extends React.Component<Props> {
  readonly state = {
    status: Status.Clear,
    error: null,
    graphKey: null,
  };

  onSaveClick = () => {
    const { selection } = this.props;
    if (!selection || selection.length <= 0) {
      this.setState({
        status: Status.Error,
        error: { eMessage: "Invalid selection of entities" },
      });
      return;
    }

    // Get the list of entity keys that constitute this graph
    this.setState({ status: Status.Requested });
    saveGraph(selection)
      .then(graphKey => {
        this.setState({ graphKey, status: Status.Ok });
      })
      .catch(error => {
        this.setState({
          status: Status.Error,
          error: { eMessage: error ? error.message : "Unknown" },
        });
      });
  };

  render() {
    const { status, error, graphKey } = this.state;

    if (status === Status.Error || status === Status.Requested) {
      return <Meta status={status} error={error} />;
    }

    const link = `${window.location.origin}/${ROUTES.graph}/${graphKey}`;

    return (
      <div>
        {status === Status.Ok && graphKey ? (
          <React.Fragment>
            <p>You can share this link to show this graph to others:</p>
            <p>
              <BreakableA href={link}>{link}</BreakableA>
            </p>
          </React.Fragment>
        ) : (
          <IconButton withText onClick={this.onSaveClick}>
            Share this graph
          </IconButton>
        )}
      </div>
    );
  }
}

export default GraphSaver;
