import "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";

import { RootStore } from "../../Store";
import { EdgePreview, EntityPreview } from "../../utils/types";
import { getEntityPreviewFromState, objectFromArray } from "../../utils/utils";
import GraphPreparator from "../GraphPreparator";

type OwnProps = {
  entityKeys: string[];
};

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { entityKeys } = props;
  const entities: { [entityKey: string]: EntityPreview } = {};
  const edges: { [edgeKey: string]: EdgePreview } = {};

  // Extract entities
  for (let key of entityKeys) {
    const tmp = getEntityPreviewFromState(key, state);
    if (tmp) entities[key] = tmp;
    else console.warn("No data for", key);
  }

  // const edges: EdgePreview[] = Object.keys(state.links.data.all)
  //   .map(key => state.links.data.all[key])
  //   .filter(edge => entities[edge._from] && entities[edge._to]);

  // Extract all links between all entities
  const allLinks = state.links.data.all;
  for (let edgeKey in allLinks) {
    const edge = allLinks[edgeKey];
    if (entities[edge._from] && entities[edge._to]) {
      edges[edgeKey] = edge;
    }
  }

  return {
    entities,
    edges,
    entitySelection: objectFromArray(state.entitySelection),
    specialEntities: {},
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
