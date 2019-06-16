import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";

import { RootStore } from "../Store";
import { loadEntity } from "../features/entitiesLoadAC";
import ROUTES from "../utils/ROUTES";
import Meta from "../components/meta/Meta";
import { Status, DatasetId, ErrorPayload, Entity } from "../utils/types";
import { loadEntityGraph } from "../features/linksLoadAC";
import * as entitySelectionActions from "../features/entitySelectionActions";
import CONSTS from "../utils/consts";
import EntityGraphContainer from "../components/graph/EntityGraphContainer";
import SetDocumentTitle from "../components/titles/SetDocumentTitle";

const StyledMeta = styled(Meta)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(20vh);
`;

interface OwnProps extends RouteComponentProps {
  entityKey: string;
}

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { entityKey } = props;
  // Get the entity from the Redux Store
  const entity = state.entities.data[entityKey] as Entity | undefined;
  const status = state.entities.status[entityKey] as Status | undefined;
  const error = state.entities.errors[entityKey] as ErrorPayload | undefined;
  const linksStatus = state.links.status[entityKey] as Status | undefined;
  const linksError = state.links.errors[entityKey] as ErrorPayload | undefined;
  // Return everything.
  return {
    ...props,
    entityKey,
    entity,
    status,
    error,
    linksStatus,
    linksError,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      loadEntity,
      loadEntityGraph,
      selectEntities: entitySelectionActions.selectEntities,
    },
    dispatch
  );

type State = {
  prevEntityKey: null | string;
};

class EntityScreen extends Component<Props> {
  readonly state: State = {
    prevEntityKey: null,
  };

  get isWikidataEntity() {
    return Boolean(
      this.props.entity && this.props.entity.ds && this.props.entity.ds.wd
    );
  }

  componentDidMount() {
    this.fetchData();
  }

  // Maybe to do: Extract this logic to a generic component that can be
  // composed by giving it children.
  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.status === Status.Ok && props.entityKey !== state.prevEntityKey)
      return {
        prevEntityKey: props.entityKey,
      };
    return null;
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.entityKey !== prevProps.entityKey) {
      // At this point, we're in the React "commit" phase,
      // so it's safe to load the new data.
      this.fetchData();
    }
  }

  fetchData = () => {
    const { entityKey, status, linksStatus } = this.props;
    if (!status || status === Status.Error) this.props.loadEntity(entityKey);
    if (!linksStatus || linksStatus === Status.Error)
      this.props.loadEntityGraph(entityKey);
    this.props.selectEntities([entityKey]);
  };

  onEditEntity = () => {
    const { entity } = this.props;
    if (entity && entity.ds && entity.ds.wd) {
      window.location.href = `https://www.wikidata.org/wiki/${entity.ds.wd}`;
    } else {
      const url = `/${ROUTES.edit}/${ROUTES.entity}/${this.props.entityKey}`;
      this.props.history.push(url);
    }
  };

  onAddRelation = () => {
    const url = `/${ROUTES.entity}/${this.props.entityKey}/${ROUTES.relation}/${
      this.props.entityKey
    }/${CONSTS.EMPTY_KEY}`;
    this.props.history.push(url);
  };

  importWikidata = () => {
    if (this.props.entity && this.props.entity.ds && this.props.entity.ds.wd)
      this.props.history.push(
        `/${ROUTES.import}/${DatasetId.Wikidata}/${this.props.entity.ds.wd}`
      );
    else console.error("No wikidata field!");
  };

  render() {
    const { status, error, entityKey, entity } = this.props;

    // Always render the graph, even when the data isn't loaded.
    // That means using the previous key if it's there.
    // We do this to preserve displayed nodes and the simulation state.
    return (
      <React.Fragment>
        <SetDocumentTitle>{entity ? entity.name : undefined}</SetDocumentTitle>
        {status !== Status.Ok && <StyledMeta status={status} error={error} />}
        {status === Status.Ok ? (
          <EntityGraphContainer entityKey={entityKey} />
        ) : this.state.prevEntityKey ? (
          <EntityGraphContainer entityKey={this.state.prevEntityKey} />
        ) : null}
      </React.Fragment>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EntityScreen)
);
