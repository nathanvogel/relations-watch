import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";

import { RootStore } from "../Store";
import { loadEntity } from "../features/entitiesLoadAC";
import { loadEntityGraph } from "../features/linksLoadAC";
import { Status } from "../utils/types";
import Meta from "../components/meta/Meta";
import FreeGraphContainer from "../components/graph/FreeGraphContainer";

type OwnProps = {
  entityKeys: string[];
};
const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { entityKeys } = props;
  return {
    entityKeys,
    allEntities: state.entities,
    allLinks: state.links,
  };
};
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      loadEntity,
      loadEntityGraph,
    },
    dispatch
  );
type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const NetworkScreen: React.FunctionComponent<Props> = props => {
  const { entityKeys, allEntities, allLinks } = props;
  // Only load if the entityKeys props change
  useEffect(() => {
    for (let key of entityKeys) {
      if (!allEntities.status[key] || allEntities.status[key] === Status.Error)
        props.loadEntity(key);
      if (!allLinks.status[key] || allLinks.status[key] === Status.Error)
        props.loadEntityGraph(key);
    }
  }, [entityKeys]);

  let loading = false;
  for (let key of entityKeys) {
    if (
      allEntities.status[key] === Status.Requested ||
      allLinks.status[key] === Status.Requested
    )
      loading = true;
    break;
  }

  // Don't unmount and mount the Graph, we keep it displayed through
  // loading phases to keep it smooth.
  return (
    <React.Fragment>
      {loading && <Meta status={Status.Requested} />}
      <FreeGraphContainer entityKeys={entityKeys} />
    </React.Fragment>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NetworkScreen);
