import React from "react";

import NetworkScreen from "./NetworkScreen";
import api from "../utils/api";
import { Status, SavedGraph } from "../utils/types";
import Meta from "../components/meta/Meta";

const getGraph = async (graphKey: string): Promise<string[]> => {
  if (!graphKey) {
    console.error("No graphKey was provided.");
    return [];
  }
  const response = await api.get("/graphs/" + graphKey);
  if (response.status === 200) {
    const selection: string[] = [];
    const data = response.data as SavedGraph;
    for (var i = 0; i < data.entities.length; i += 1) {
      selection.push(data.entities[i].entityKey);
    }
    return selection;
  } else {
    console.error(
      "Error" + response.status + " while requesting graph " + graphKey
    );
    console.error(response);
  }
  return [];
};

type Props = {
  graphKey?: string;
};

class SavedGraphScreen extends React.Component<Props> {
  readonly state = {
    status: Status.Clear,
    error: null,
    selection: [],
  };

  componentDidMount() {
    const { graphKey } = this.props;
    // Verify that we have a graph key
    if (!graphKey) {
      this.setState({
        status: Status.Error,
        error: { eMessage: "Invalid graph ID provided" },
      });
      return;
    }

    // Get the list of entity keys that constitute this graph
    this.setState({ status: Status.Requested });
    getGraph(graphKey)
      .then(selection => {
        this.setState({ selection, status: Status.Ok });
      })
      .catch(error => {
        this.setState({
          status: Status.Error,
          error: { eMessage: error ? error.message : "Unknown" },
        });
      });
  }

  render() {
    const { status, error, selection } = this.state;
    if (status !== Status.Ok) {
      return <Meta status={status} error={error} />;
    }

    return <NetworkScreen entityKeys={selection} />;
  }
}

export default SavedGraphScreen;
