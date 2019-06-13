import React from "react";
import { connect } from "react-redux";

import { RootStore } from "../Store";
import NetworkScreen from "./NetworkScreen";
import graphSelections from "../utils/some-graph-selections";
import { arrayWithoutDuplicates } from "../utils/utils";

const mapStateToProps = (state: RootStore) => {
  // const entitySelection = state.entitySelection;
  const entitySelection = graphSelections.trumpfamily;
  return {
    entitySelection,
  };
};
type Props = ReturnType<typeof mapStateToProps>;

const HistoryScreen: React.FunctionComponent<Props> = props => {
  const { entitySelection } = props;
  return <NetworkScreen entityKeys={entitySelection} />;
};

export default connect(
  mapStateToProps,
  () => ({})
)(HistoryScreen);
