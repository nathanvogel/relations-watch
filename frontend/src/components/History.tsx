import React from "react";
import styled from "styled-components";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { Link, Switch, Route } from "react-router-dom";
import { RootStore } from "../Store";
import {
  selectEntities,
  deselectEntities,
} from "../features/entitySelectionActions";
import ROUTES from "../utils/ROUTES";
import { ReactComponent as CloseIcon } from "../assets/ic_close.svg";
import { EntityPreview } from "../utils/types";
import SecondaryTitle from "./titles/SecondaryTitle";
import { getEntitySAsset } from "../assets/EntityIcons";
import EntityImageM from "./entity/EntityImageM";

const Content = styled.div`
  width: 100%;
`;

const List = styled.ul`
  font-size: ${props => props.theme.fontSizeM};
  margin-top: ${props => props.theme.blockSpacingTB};

  // Remove bullet
  list-style-type: none;
  margin-block-start: ${props => props.theme.inputTBSpacing};
  margin-block-end: ${props => props.theme.blockSpacingTB};
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

const ItemLink = styled(Link)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  // Necessary inside flex.
  // Source: https://css-tricks.com/flexbox-truncated-text/
  min-width: 0px;
`;

const ClearButton = styled(CloseIcon)`
  min-width: 12px;
  cursor: pointer;
  margin-right: ${props => props.theme.inputLRSpacing};
`;

type OwnProps = {
  currentEntityKey?: string;
  editable: boolean;
};

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { entitySelection } = state;
  const selectedEntities: Array<
    undefined | EntityPreview
  > = entitySelection.map(key => state.entities.datapreview[key]);
  return {
    ...props,
    entitySelection,
    selectedEntities,
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
  return (
    <Content>
      <SecondaryTitle>History</SecondaryTitle>
      {/* Only render the link if we aren't already at the history */}
      <Switch>
        <Route exact path={`/${ROUTES.history}`} render={_ => null} />
        <Route
          path="/:subpath"
          render={_ => <Link to={`/${ROUTES.history}`}>Network graph</Link>}
        />
      </Switch>
      {props.entitySelection.length <= 0 ? (
        <p>Empty</p>
      ) : (
        <List>
          {entities.map((_, index) => {
            const e = entities[entities.length - 1 - index];
            if (!e) return null;
            return (
              <ListItem key={e._key}>
                {props.editable && (
                  <ClearButton
                    onClick={() => props.deselectEntities([e._key])}
                  />
                )}
                <EntityImageM src={getEntitySAsset(e.type)} />
                <ItemLink to={`/${ROUTES.entity}/${e._key}`}>{e.name}</ItemLink>
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
