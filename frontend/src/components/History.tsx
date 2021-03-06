import React from "react";
import styled from "styled-components";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { Link, Route, Switch } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import GraphIcon from "@material-ui/icons/DeviceHub";
import { RootStore } from "../Store";
import {
  selectEntities,
  deselectEntities,
} from "../features/entitySelectionActions";
import ROUTES from "../utils/ROUTES";
import { EntityPreview } from "../utils/types";
import TertiaryTitle from "./titles/TertiaryTitle";
import { getEntitySAsset } from "../assets/EntityIcons";
import EntityImageM from "./entity/EntityImageM";
import EntityName from "./entity/EntityName";
import IconButton, { IconButtonLink } from "./buttons/IconButton";
import HistoryAdder from "./history/HistoryAdder";
import ButtonBar from "./buttons/ButtonBar";
import SecondaryTitle from "./titles/SecondaryTitle";

const Content = styled.div`
  width: 100%;
  margin-top: 32px;
`;

const List = styled.ul`
  font-size: ${props => props.theme.fontSizeM};
  margin-top: 8px;

  // Remove bullet
  list-style-type: none;
  // margin-block-start: ${props => props.theme.blockSpacingTB};
  // margin-block-end: ${props => props.theme.blockSpacingTB};
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0px;
`;

const ListItem = styled.li`
  // Align items
  display: flex;
  align-items: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const Name = styled(EntityName)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const ItemLink = styled(Link)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  flex-grow: 1;
  // Necessary inside flex.
  // Source: https://css-tricks.com/flexbox-truncated-text/
  min-width: 0px;
`;

const CloseButton = styled(IconButton)`
  // min-width: 12px;
  // cursor: pointer;
  // margin-right: ${props => props.theme.inputLRSpacing};
  flex-shrink: 1;
  align-self: flex-end;
  min-width: 38px;
  line-height: 1;
  padding: 2px;
  min-height: 0px;
`;

type OwnProps = {
  editable: boolean;
};

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { entitySelection } = state;
  const selectedEntities: Array<
    undefined | EntityPreview
  > = entitySelection.map(key => state.entities.datapreview[key]);
  const hover = state.hover;
  return {
    ...props,
    entitySelection,
    selectedEntities,
    hover,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      selectEntities,
      deselectEntities,
    },
    dispatch
  );

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const History: React.FunctionComponent<Props> = props => {
  const entities = props.selectedEntities;
  const { entitySelection } = props;
  const hover = props.hover;
  return (
    <Content>
      <Switch>
        <Route
          path={`/${ROUTES.history}`}
          render={props => <TertiaryTitle>Recently seen</TertiaryTitle>}
        />
        <Route
          render={props => (
            <React.Fragment>
              <TertiaryTitle>Recently seen</TertiaryTitle>
              <ButtonBar>
                {entitySelection.length > 1 && (
                  <IconButtonLink withText to={`/${ROUTES.history}`}>
                    <GraphIcon />
                    Go to the graph
                  </IconButtonLink>
                )}
                <HistoryAdder />
              </ButtonBar>
            </React.Fragment>
          )}
        />
      </Switch>
      {props.entitySelection.length <= 0 ? (
        <p>
          Your 'Recently seen' history is empty, so there're no entities to
          display.
          <br />
          You can search an entity or go to the <Link to="/">homepage</Link>.
        </p>
      ) : (
        <List>
          {entities.map((_, index) => {
            const e = entities[entities.length - 1 - index];
            if (!e) return null;
            return (
              <ListItem key={e._key}>
                <EntityImageM src={getEntitySAsset(e.type)} />
                <ItemLink to={`/${ROUTES.entity}/${e._key}`}>
                  <Name>
                    {e._key === hover.entityKey ||
                    e._key === hover.relationSourceKey ||
                    e._key === hover.relationTargetKey ? (
                      <strong>{e.name}</strong>
                    ) : (
                      e.name
                    )}
                  </Name>
                </ItemLink>
                {props.editable && (
                  <CloseButton onClick={() => props.deselectEntities([e._key])}>
                    <CloseIcon />
                  </CloseButton>
                )}
              </ListItem>
            );
          })}
        </List>
      )}
    </Content>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(History);
