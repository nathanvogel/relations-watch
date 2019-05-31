import React from "react";
import styled from "styled-components";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { RootStore } from "../Store";
import {
  selectEntities,
  deselectEntities,
} from "../features/entitySelectionActions";
import ROUTES from "../utils/ROUTES";
import { ReactComponent as CloseIcon } from "../assets/ic_close.svg";
import { ReactComponent as AddIcon } from "../assets/ic_add.svg";
import TertiaryTitle from "./titles/TertiaryTitle";
import { EntityPreview } from "../utils/types";

const Content = styled.div`
  width: 100%;
`;

const HistoryGraphTitle = styled(TertiaryTitle)`
  color: inherit;
  font-weight: bold;
`;

const List = styled.ul`
  font-size: ${props => props.theme.fontSizeS};
  list-style-type: none;
  margin-block-start: ${props => props.theme.inputTBSpacing};
  margin-block-end: ${props => props.theme.blockSpacingTB};
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0px;

  li {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ClearButton = styled(CloseIcon)`
  cursor: pointer;
  margin-right: ${props => props.theme.inputLRSpacing};
`;
const NewRelationButton = styled(AddIcon)`
  cursor: pointer;
  margin-right: ${props => props.theme.inputLRSpacing};
`;

type OwnProps = {
  currentEntityKey?: string;
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
  if (props.entitySelection.length <= 1) return <Content />;
  return (
    <Content>
      <Link to={`/${ROUTES.history}`}>
        <HistoryGraphTitle>Your history graph</HistoryGraphTitle>
      </Link>
      <List>
        {entities.map((_, index) => {
          const e = entities[entities.length - 1 - index];
          if (!e) return null;
          if (props.currentEntityKey === e._key) return null;
          return (
            <li key={e._key}>
              <ClearButton onClick={() => props.deselectEntities([e._key])} />
              {props.currentEntityKey && (
                <Link
                  to={`/${ROUTES.relation}/${e._key}/${props.currentEntityKey}`}
                >
                  <NewRelationButton />
                </Link>
              )}
              <Link to={`/${ROUTES.entity}/${e._key}`}>{e.name}</Link>
            </li>
          );
        })}
      </List>
    </Content>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(History);
