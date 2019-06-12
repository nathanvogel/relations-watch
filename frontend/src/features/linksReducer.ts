import ACTIONS from "../utils/ACTIONS";
import { EdgePreview, Edge } from "../utils/types";
import update from "immutability-helper";
import { AnyAction } from "redux";
import { getSimplifiedEdge, getEdgePreview } from "../utils/utils";
import * as TYPED_ACTIONS from "../utils/ACTIONS";
import { InbetweenAction } from "./inbetweenActions";

interface SubState {
  data: {
    all: { [edgeKey: string]: EdgePreview };
  };
  status: {};
  errors: {};
}
const defaultState: SubState = {
  data: {
    all: {},
  },
  status: {},
  errors: {},
};

export default (state = defaultState, action: AnyAction) => {
  switch (action.type) {
    // When a new relation element is added, we get the new edge as a
    // confirmation back from the server, so we add it to the store at this
    // point.
    case ACTIONS.EdgeSaveSuccess:
      const edge = getSimplifiedEdge(action.payload as Edge);
      const edgePreview = getEdgePreview(edge);
      return update(state, {
        data: {
          all: { $merge: { [edgePreview._key]: edgePreview } },
        },
      });
    case ACTIONS.EdgeDeleteSuccess:
      return update(state, {
        data: {
          all: { $unset: [action.meta._key] },
        },
      });
    case ACTIONS.LinksLoadRequested:
      const key1 = action.meta.entityKey as string;
      return update(state, {
        status: { [key1]: { $set: action.status } },
      });
    case ACTIONS.LinksLoadSuccess:
      if (!action.payload || !action.payload.edges) {
        console.error("Invalid action: " + ACTIONS.LinksLoadSuccess);
        return state;
      }
      const edges = action.payload.edges as Array<EdgePreview>;
      const entityKey = action.meta.entityKey;
      // Build an object from the server array
      const edgeList: { [key: string]: EdgePreview } = {};
      for (let e of edges) {
        const edge = getSimplifiedEdge(e);
        edgeList[edge._key] = edge;
      }
      return update(state, {
        data: {
          all: { $merge: edgeList },
        },
        status: { [entityKey]: { $set: action.status } },
        errors: { [entityKey]: { $set: action.meta.error } },
      });
    case TYPED_ACTIONS.InbetweenLinksLoadSuccess:
      const a = action as InbetweenAction;
      if (!a.edges) {
        console.error("Invalid action: " + action.action);
        return state;
      }
      console.log(a);
      // Build an object from the server array
      const edgeList2: { [key: string]: EdgePreview } = {};
      for (let e of a.edges) {
        const edge = getSimplifiedEdge(e);
        edgeList2[edge._key] = edge;
      }
      return update(state, {
        data: { all: { $merge: edgeList2 } },
      });
    case ACTIONS.LinksLoadError:
      const key3 = action.meta.relationId as string;
      return update(state, {
        data: { [key3]: { $set: null } },
        status: { [key3]: { $set: action.status } },
        errors: { [key3]: { $set: action.meta.error } },
      });
    default:
      return state;
  }
};
