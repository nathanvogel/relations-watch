import ACTIONS from "../utils/ACTIONS";
import {
  EdgePreview,
  Edge,
  Connections,
  LinkedEntities,
  ConnectionsList,
} from "../utils/types";
import update from "immutability-helper";
import { AnyAction } from "redux";
import {
  getSimplifiedEdge,
  getRelationId,
  getEdgePreview,
} from "../utils/utils";

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

function addEdgeToBothEntities(
  listByEntity: { [key: string]: Connections },
  edge: EdgePreview
) {
  if (!listByEntity[edge._from])
    listByEntity[edge._from] = genEmptyConnections(edge);
  else listByEntity[edge._from].edges.push(edge);
  if (!listByEntity[edge._to])
    listByEntity[edge._to] = genEmptyConnections(edge);
  else listByEntity[edge._to].edges.push(edge);
}

const genEmptyConnections = (edge?: EdgePreview): Connections => ({
  edges: edge ? [edge] : [],
  entities: [],
  toEntity: {},
});

function addLinkToEntityList(list: ConnectionsList, k1: string, k2: string) {
  if (!list[k1]) list[k1] = genEmptyConnections();
  if (!list[k1].toEntity[k2]) list[k1].toEntity[k2] = 1;
  else list[k1].toEntity[k2] += 1;
}
