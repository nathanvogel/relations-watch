import "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import { RootStore } from "../../Store";
import GraphPreparator from "../GraphPreparator";
import {
  getConnectedEntities,
  getDefaultSpecialEntityFromMain,
} from "../../features/entitiesSelector";
import { getConnectedEdges } from "../../features/linksSelector2";
import { getSelectedEntitiesObj } from "../../features/entitySelectionSelector";
import { displayedEntities } from "../../features/displayedEntitiesActions";

type OwnProps = {
  entityKey: string;
};

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  return {
    entities: getConnectedEntities(state, props),
    edges: getConnectedEdges(state, props),
    selectedEntities: getSelectedEntitiesObj(state),
    specialEntities: getDefaultSpecialEntityFromMain(state, props),
    network: false,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ displayedEntities }, dispatch);

const EntityGraphContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphPreparator);

export default EntityGraphContainer;
