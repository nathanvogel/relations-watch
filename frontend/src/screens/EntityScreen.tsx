import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";

import { RootStore } from "../Store";
import { loadEntity } from "../features/entitiesLoadAC";
import ROUTES from "../utils/ROUTES";
import Meta from "../components/meta/Meta";
import { Status, DatasetId } from "../utils/types";
import { loadEntityGraph } from "../features/linksLoadAC";
import EntityGraphV4 from "../components/EntityGraphV4";
import * as entitySelectionActions from "../features/entitySelectionActions";
import ButtonBar from "../components/buttons/ButtonBar";
import IconButton from "../components/buttons/IconButton";
import { ReactComponent as AddIcon } from "../assets/ic_add.svg";
import { ReactComponent as EditIcon } from "../assets/ic_edit.svg";
import CONSTS from "../utils/consts";

const Content = styled.div``;

const StyledMeta = styled(Meta)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(20vh);
`;

interface EntityMatch {
  entityKey: string;
}

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (state: RootStore, props: RouteComponentProps) => {
  // Get the entityKey from the Router props
  const params = props.match.params as EntityMatch;
  const entityKey: string = params["entityKey"];
  // Get the entity from the Redux Store
  const entity = state.entities.data[entityKey];
  const status = state.entities.status[entityKey];
  const error = state.entities.errors[entityKey];
  const linkedEntities = state.links.data.byentity[entityKey]
    ? state.links.data.byentity[entityKey].entities
    : [];
  const linksStatus = state.links.status[entityKey];
  const linksError = state.links.errors[entityKey];
  // Return everything.
  return {
    ...props,
    entityKey,
    entity,
    status,
    error,
    linkedEntities,
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
  readonly state: State = { prevEntityKey: null };

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
    if (this.props.selectEntities) this.props.selectEntities([entityKey]);
  };

  onEditEntity = () => {
    const url = `/${ROUTES.edit}/${ROUTES.entity}/${this.props.entityKey}`;
    this.props.history.push(url);
  };

  onAddRelation = () => {
    const url = `/${ROUTES.relation}/${this.props.entityKey}/${
      CONSTS.EMPTY_KEY
    }`;
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
    const { entity, status, error, entityKey } = this.props;

    // Render loading status and error.

    return (
      <Content>
        {status !== Status.Ok && <StyledMeta status={status} error={error} />}
        <ButtonBar>
          <IconButton withText onClick={this.onEditEntity}>
            <EditIcon />
            Edit {status === Status.Ok && entity.name}
          </IconButton>
          <IconButton withText onClick={this.onAddRelation}>
            <AddIcon />
            New relation
          </IconButton>
          {this.isWikidataEntity && (
            <IconButton withText onClick={this.importWikidata}>
              Import relations from Wikidata
            </IconButton>
          )}
        </ButtonBar>
        {status === Status.Ok ? (
          <EntityGraphV4 entityKey={entityKey} />
        ) : this.state.prevEntityKey ? (
          <EntityGraphV4 entityKey={this.state.prevEntityKey} />
        ) : null}
      </Content>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EntityScreen)
);
