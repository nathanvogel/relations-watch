import React, { Component, FunctionComponent } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import styled, { css } from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";

import { RootStore } from "../Store";
import { loadEntity } from "../features/entitiesLoadAC";
import ROUTES from "../utils/ROUTES";
import Meta from "../components/meta/Meta";
import { Status, DatasetId } from "../utils/types";
import { loadEntityGraph } from "../features/linksLoadAC";
import * as entitySelectionActions from "../features/entitySelectionActions";
import IconButton from "../components/buttons/IconButton";
import { ReactComponent as AddIcon } from "../assets/ic_add.svg";
import { ReactComponent as EditIcon } from "../assets/ic_edit.svg";
import CONSTS from "../utils/consts";
import { withTranslation, WithTranslation } from "react-i18next";
import R from "../strings/R";
import { media, Mobile, NotMobile } from "../styles/responsive-utils";
import History from "../components/History";
import GraphLegend from "../components/graph/GraphLegend";
import EntityGraphContainer from "../components/graph/EntityGraphContainer";
import AppBar from "../components/AppBar";
import WebsiteTitle from "../components/titles/WebsiteTitle";

const Content = styled.div`
  position: relative;
  overflow: hidden;
  margin-left: ${props => props.theme.appSidebarWidth};
  ${media.mobile`margin-left: 0;`}
`;

const StyledMeta = styled(Meta)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(20vh);
`;

const Name = styled.div`
  text-align: left;
  font-weight: 700;
  font-size: ${props => props.theme.fontSizeM};
  font-family: ${props => props.theme.secondaryFont};
  font-size: 24px;
`;

const Description = styled.div`
  text-align: left;
  font-size: ${props => props.theme.fontSizeM};
  margin-bottom: ${props => props.theme.marginTB};
`;

const EntityButton = styled(IconButton)`
  display: block;
  margin: ${props => props.theme.inputTBSpacing} 0px;
`;

interface ColumnProps {
  hideColumn?: boolean;
}

const StyledDrawer = styled(Drawer)`
  border-right: none;

  .MuiDrawer-paperAnchorDockedLeft {
    border-right: none;
  }
` as typeof Drawer;
// = necessary hack for now
// https://github.com/mui-org/material-ui/issues/13921#issuecomment-484133463

const DrawerContent = styled.div`
  background-color: ${props => props.theme.sidebarBG};
  border-right: solid 1px ${props => props.theme.darkBG};
  box-sizing: border-box;
  height: 100%;
`;

const LeftColumn = styled.div`
  display: block;
  min-width: ${props => props.theme.appSidebarWidth};
  width: ${props => props.theme.appSidebarWidth};
  max-width: 100vw;
  padding: ${props => props.theme.blockPadding};
  padding-top: 16px;
  box-sizing: border-box;
  background-color: ${props => props.theme.sidebarBG};
`;

const RightColumn = styled(LeftColumn)<ColumnProps>`
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
  background-color: ${props => props.theme.appBG};
  opacity: 0.95;
  // box-shadow: -15px 0px 15px 0px ${props => props.theme.sidebarBG};
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
  const linksStatus = state.links.status[entityKey];
  const linksError = state.links.errors[entityKey];
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
  showTitleCard: boolean;
  mobileOpen: boolean;
};

class EntityScreen extends Component<Props> {
  readonly state: State = {
    prevEntityKey: null,
    showLegend: window.innerWidth >= 800,
    showTitleCard: true,
    mobileOpen: false,
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

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  handleDrawerOpen = () => {
    this.setState({ mobileOpen: true });
  };
  handleDrawerClose = () => {
    this.setState({ mobileOpen: false });
  };

  render() {
    const { entity, status, error, entityKey, t } = this.props;

    const drawerContent = (
      <DrawerContent>
        <WebsiteTitle />
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
      </DrawerContent>
    );

    // Always render the graph, even when the data isn't loaded,
    return (
      <Content>
        <AppBar onLeftMenuClick={this.handleDrawerToggle} />
        {status !== Status.Ok && <StyledMeta status={status} error={error} />}

        <nav className={"test"} aria-label="Graph Info">
          <Mobile>
            <SwipeableDrawer
              variant="temporary"
              anchor="left"
              open={this.state.mobileOpen}
              onOpen={this.handleDrawerOpen}
              onClose={this.handleDrawerClose}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawerContent}
            </SwipeableDrawer>
          </Mobile>
          <NotMobile>
            <StyledDrawer variant="permanent" open>
              {drawerContent}
            </StyledDrawer>
          </NotMobile>
        </nav>

        <RightColumn hideColumn={!this.state.showLegend}>
          <GraphLegend />
        </RightColumn>
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
