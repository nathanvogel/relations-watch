import "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";

import { RootStore } from "../../Store";
import { EdgePreview, EntityPreview, NodeRenderType } from "../../utils/types";
import { getEntityPreviewFromState, objectFromArray } from "../../utils/utils";
import GraphPreparator from "../GraphPreparator";

type OwnProps = {
  entityKey: string;
};

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { entityKey } = props;
  const entities: { [entityKey: string]: EntityPreview } = {};
  const edges: { [edgeKey: string]: EdgePreview } = {};

  const addEntity = (key: string) => {
    // Don't re-add entities
    if (entities[key]) return;
    // Extract it from the state
    const tmp = getEntityPreviewFromState(key, state);
    if (tmp) entities[key] = tmp;
    else console.warn("No data for", key);
  };

  // Render the main entity even if links aren't loaded yet.
  addEntity(entityKey);

  const allLinks = state.links.data.all;
  for (let edgeKey in allLinks) {
    const edge = allLinks[edgeKey];
    if (edge._from === entityKey || edge._to === entityKey) {
      edges[edgeKey] = edge;
      addEntity(edge._from);
      addEntity(edge._to);
    }
  }

  return {
    entities,
    edges,
    entitySelection: objectFromArray(state.entitySelection),
    specialEntities: {
      [entityKey]: {
        x: 0.5,
        y: 0.5,
        type: NodeRenderType.Primary,
      },
    },
    network: false,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({}, dispatch);

const EntityGraphContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphPreparator);

export default EntityGraphContainer;
