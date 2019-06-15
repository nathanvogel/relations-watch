import React from "react";
import { connect } from "react-redux";
import LinkIcon from "@material-ui/icons/Link";
import { Status, SavedGraphEntity, SavedGraph } from "../utils/types";
import api from "../utils/api";
import IconButton from "./buttons/IconButton";
import Meta from "./meta/Meta";
import ROUTES from "../utils/ROUTES";
import LinkSharer from "./LinkSharer";
import { RootStore } from "../Store";

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

const mapStateToProps = (state: RootStore) => ({
  selection: state.entitySelection,
});
const mapDispatchToProps = () => ({});

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
    const { selection } = this.props;

    if (status === Status.Error || status === Status.Requested) {
      return <Meta status={status} error={error} />;
    }

    if (!selection || selection.length <= 0) return null;

    const link = `${window.location.origin}/${ROUTES.graph}/${graphKey}`;

    return (
      <div>
        {status === Status.Ok && graphKey ? (
          <LinkSharer link={link}>
            Share this link to show this graph to anyone:
          </LinkSharer>
        ) : (
          <IconButton withText onClick={this.onSaveClick}>
            <LinkIcon />
            Share network
          </IconButton>
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphSaver);
