import "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";

import { RootStore } from "../../Store";
import GraphPreparator from "../GraphPreparator";
import { getSelectedEntitiesObj } from "../../features/entitySelectionSelector";
import { getSomeEntityPreviews } from "../../features/entitiesSelector";
import { getConnectingEdges } from "../../features/linksSelector2";

type OwnProps = {
  entityKeys: string[];
};

// For memoization
const defaultSpecialEntities = {};

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  // If another component was to use any of the same selectors that gets a
  // 'props' argument, it would need to be memoized in a factory like here:
  // https://redux.js.org/recipes/computing-derived-data#sharing-selectors-across-multiple-components
  return {
    entities: getSomeEntityPreviews(state, props),
    edges: getConnectingEdges(state, props),
    selectedEntities: getSelectedEntitiesObj(state),
    specialEntities: defaultSpecialEntities,
    network: true,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({}, dispatch);

const FreeGraphContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphPreparator);

export default FreeGraphContainer;
