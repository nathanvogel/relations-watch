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
import IconButton from "../components/buttons/IconButton";
import { ReactComponent as AddIcon } from "../assets/ic_add.svg";
import { ReactComponent as EditIcon } from "../assets/ic_edit.svg";
import CONSTS from "../utils/consts";
import { withTranslation, WithTranslation } from "react-i18next";
import R from "../strings/R";
import History from "../components/History";
import GraphLegend from "../components/graph/GraphLegend";
import EntityGraphContainer from "../components/graph/EntityGraphContainer";
import DrawerLayout from "../components/layout/DrawerLayout";
import EntityName from "../components/entity/EntityName";

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledMeta = styled(Meta)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(20vh);
`;

interface LegendProps {
  hideColumn?: boolean;
}

const LegendColumn = styled.div<LegendProps>`
  display: ${props => (props.hideColumn ? "none" : "block")}
  position: absolute;
  right: 16px;
  left: unset;
  top: unset;
  bottom: 16px;
  height: auto;
  overflow-y: auto;
  min-width: ${props => props.theme.appMiniSidebarWidth};
  width: ${props => props.theme.appMiniSidebarWidth};
  max-height: calc(100vh - ${props => props.theme.navBarHeight} - 20px);
  padding: ${props => props.theme.blockPadding};
  box-sizing: border-box;
  // box-shadow: -15px 0px 15px 0px ${props => props.theme.sidebarBG};
  // Space for the toggle button
  padding-bottom: 44px;

  background-color: ${props => props.theme.appBG};
  opacity: 0.95;

  transition: transform 0.18s ease-out;
  transform: translateX(${props => (props.hideColumn ? "100" : "0")}%);
`;

const ToggleLegendButton = styled(IconButton)`
  position: absolute;
  bottom: 18px;
  right: 18px;
`;

interface OwnProps extends RouteComponentProps {
  entityKey: string;
}

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithTranslation;

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
  showLegend: boolean;
};

class EntityScreen extends Component<Props> {
  readonly state: State = {
    prevEntityKey: null,
    showLegend: false,
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
    if (this.props.selectEntities) this.props.selectEntities([entityKey]);
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

  toggleLegend = () => {
    this.setState({
      showLegend: !this.state.showLegend,
    });
  };

  render() {
    const { entity, status, error, entityKey, t } = this.props;

    // Always render the graph, even when the data isn't loaded,
    return (
      <Content>
        {status !== Status.Ok && <StyledMeta status={status} error={error} />}

        <LegendColumn hideColumn={!this.state.showLegend}>
          <GraphLegend />
        </LegendColumn>
        <ToggleLegendButton small withText onClick={this.toggleLegend}>
          {t(
            this.state.showLegend ? R.button_hide_legend : R.button_show_legend
          )}
        </ToggleLegendButton>

        {status === Status.Ok ? (
          <EntityGraphContainer entityKey={entityKey} />
        ) : this.state.prevEntityKey ? (
          <EntityGraphContainer entityKey={this.state.prevEntityKey} />
        ) : null}
      </Content>
    );
  }
}

export default withTranslation()(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(EntityScreen)
  )
);
