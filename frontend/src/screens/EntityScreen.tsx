import React, { Component, FunctionComponent } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import styled, { css } from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";

import { RootStore } from "../Store";
import { loadEntity } from "../features/entitiesLoadAC";
import ROUTES from "../utils/ROUTES";
import Meta from "../components/meta/Meta";
import {
  Status,
  DatasetId,
  RelationTypeValues,
  EntityType,
} from "../utils/types";
import { loadEntityGraph } from "../features/linksLoadAC";
import EntityGraphV4 from "../components/EntityGraphV4";
import * as entitySelectionActions from "../features/entitySelectionActions";
import ButtonBar from "../components/buttons/ButtonBar";
import IconButton from "../components/buttons/IconButton";
import { ReactComponent as AddIcon } from "../assets/ic_add.svg";
import { ReactComponent as EditIcon } from "../assets/ic_edit.svg";
import CONSTS from "../utils/consts";
import { RELATION_COLORS } from "../styles/theme";
import { LegendRelationTypeMapping } from "../strings/strings";
import { withTranslation, WithTranslation } from "react-i18next";
import { getEntitySAsset } from "../assets/EntityIcons";
import R from "../strings/R";
import { media } from "../styles/media-styles";
import History from "../components/History";
import GraphLegend from "../components/graph/GraphLegend";

const Content = styled.div`
  position: relative;
  overflow: hidden;
`;

const StyledMeta = styled(Meta)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(20vh);
`;

const Name = styled.div`
  text-align: left;
  font-weight: bold;
  font-size: ${props => props.theme.fontSizeM};
  ${media.mobile`font-size: ${(props: any) => props.theme.fontSizeS};`}
`;

const Description = styled.div`
  text-align: left;
  font-size: ${props => props.theme.fontSizeS};
  margin-bottom: ${props => props.theme.marginTB};
`;

const EntityButton = styled(IconButton)`
  display: block;
  margin: ${props => props.theme.inputTBSpacing} 0px;
  ${media.mobile`display: none;`}
`;

interface ColumnProps {
  hideColumn?: boolean;
}

const LeftColumn = styled.div<ColumnProps>`
  display: ${props => (props.hideColumn ? "none" : "block")}
  position: absolute;
  left: 0px;
  top: 0px;
  max-height: 100%;
  min-width: ${props => props.theme.appSidebarWidth};
  width: ${props => props.theme.appSidebarWidth};
  padding: ${props => props.theme.blockPadding};
  padding-top: 16px;
  box-sizing: border-box;
  background-color: ${props => props.theme.sidebarBG};
  box-shadow: 15px 0px 15px 0px ${props => props.theme.sidebarBG};
`;

const RightColumn = styled(LeftColumn)<ColumnProps>`
  right: 16px;
  left: unset;
  top: unset;
  bottom: 16px;
  height: auto;
  overflow-y: auto;
  min-width: ${props => props.theme.appMiniSidebarWidth};
  width: ${props => props.theme.appMiniSidebarWidth};
  box-shadow: -15px 0px 15px 0px ${props => props.theme.sidebarBG};
  // Space for the toggle button
  padding-bottom: 44px;

  transition: transform 0.18s ease-out;
  transform: translateX(${props => (props.hideColumn ? "100" : "0")}%);
`;

const ToggleLegendButton = styled(IconButton)`
  position: absolute;
  bottom: 18px;
  right: 18px;
`;

const ToggleTitleCardButton = styled(IconButton)`
  position: absolute;
  top: ${props => props.theme.blockPadding};
  left: ${props => props.theme.blockPadding};
`;

interface EntityMatch {
  entityKey: string;
}

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithTranslation;

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
  showLegend: boolean;
  showTitleCard: boolean;
};

class EntityScreen extends Component<Props> {
  readonly state: State = {
    prevEntityKey: null,
    showLegend: window.innerWidth >= 800,
    showTitleCard: true,
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

  toggleLegend = () => {
    this.setState({
      showLegend: !this.state.showLegend,
    });
  };

  toggleTitleCard = () => {
    this.setState({
      showTitleCard: !this.state.showTitleCard,
    });
  };

  render() {
    const { entity, status, error, entityKey, t } = this.props;

    return (
      <Content>
        {status !== Status.Ok && <StyledMeta status={status} error={error} />}
        {this.state.showTitleCard ? (
          <LeftColumn>
            {status === Status.Ok && (
              <React.Fragment>
                <Name onClick={this.toggleTitleCard}>{entity.name} </Name>
                <Description onClick={this.toggleTitleCard}>
                  {entity.text}
                </Description>
              </React.Fragment>
            )}
            <EntityButton small withText onClick={this.onEditEntity}>
              <EditIcon />
              Edit
            </EntityButton>
            <EntityButton small withText onClick={this.onAddRelation}>
              <AddIcon />
              Relation
            </EntityButton>
            {this.isWikidataEntity && (
              <EntityButton small withText onClick={this.importWikidata}>
                Update from Wikidata
              </EntityButton>
            )}
            <History currentEntityKey={entity ? entity._key : undefined} />
          </LeftColumn>
        ) : (
          <ToggleTitleCardButton small withText onClick={this.toggleTitleCard}>
            {t(R.button_show_more)}
          </ToggleTitleCardButton>
        )}
        <RightColumn hideColumn={!this.state.showLegend}>
          <GraphLegend />
        </RightColumn>
        <ToggleLegendButton small withText onClick={this.toggleLegend}>
          {t(
            this.state.showLegend ? R.button_hide_legend : R.button_show_legend
          )}
        </ToggleLegendButton>

        {status === Status.Ok ? (
          <EntityGraphV4 entityKey={entityKey} />
        ) : this.state.prevEntityKey ? (
          <EntityGraphV4 entityKey={this.state.prevEntityKey} />
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
