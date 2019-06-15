import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import styled, { css } from "styled-components";

import { RootStore } from "../Store";
import ROUTES from "../utils/ROUTES";
import { mediaq } from "../styles/responsive-utils";
import { connect } from "react-redux";
import EntityDetails from "../components/EntityDetails";
import EntitySearch from "../components/EntitySearch";
import { emptyOrRealKey, keyForUrl } from "../utils/utils";
import { EntitySelectOption } from "../utils/types";
import { loadRelation } from "../features/edgesLoadAC";
import BigLinksPreview from "../components/BigLinksPreview";
import { selectEntities } from "../features/entitySelectionActions";
import { MiniInfoText } from "./titles/MiniInfoText";
import EntityActions from "./entity/EntityActions";

const limitedContainerCSS = css`
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
`;

interface ContainerProps {
  fullyVisible: boolean;
}
const Container = styled.div<ContainerProps>`
  ${props => (props.fullyVisible ? "" : limitedContainerCSS)}

  padding: ${props => props.theme.blockPadding};
  box-sizing: border-box;
`;
// padding-bottom: ${props => props.fullyVisible ? props.theme.blockPadding : "0px"}

const Grid = styled.div`
  display: flex;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;

  ${mediaq.mobile} {
    display: block;
  }
`;

interface ColumnProps {
  column: 1 | 2 | 3;
}
const StyledEntityDetails = styled(EntityDetails)<ColumnProps>`
  grid-column: ${props => props.column}
  grid-row: 1;
  & .entityview {
    height: 100%;
  }
`;
const StyledEntityActions = styled(EntityActions)<ColumnProps>`
  grid-column: ${props => props.column}
  grid-row: 2;
  text-align: ${props => (props.column === 1 ? "left" : "right")};
  ${mediaq.mobile} {
    text-align: left;
  }
`;
const StyledEntitySearch = styled(EntitySearch)<ColumnProps>`
  grid-column: ${props => props.column}
  grid-row: 1;
  justify-self: start;
  align-self: start;
`;
const StyledBigLinksPreview = styled(BigLinksPreview)`
  grid-column: 2
  grid-row: 1;
  align-self: center;
  z-index: -1;
`;

const ClickForFull = styled(MiniInfoText)`
  margin-top: ${props => props.theme.marginTB};
  text-align: center;
`;

type OwnProps = {
  entity1Key?: string;
  entity2Key?: string;
  fullyVisible: boolean;
};

// TODO unconnect component
const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { entity1Key, entity2Key, fullyVisible } = props;
  const realKey1 = emptyOrRealKey(entity1Key);
  const realKey2 = emptyOrRealKey(entity2Key);

  return {
    realKey1,
    realKey2,
    fullyVisible,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ loadRelation, selectEntities }, dispatch);

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

class RelationPreview extends React.Component<Props> {
  onEntity1Selected = (option: EntitySelectOption) => {
    const k1 = keyForUrl(option.value);
    const k2 = keyForUrl(this.props.realKey2);
    this.props.history.push(
      `${this.props.match.url}/${ROUTES.relation}/${k1}/${k2}`
    );
  };

  onEntity2Selected = (option: EntitySelectOption) => {
    const k1 = keyForUrl(this.props.realKey1);
    const k2 = keyForUrl(option.value);
    this.props.history.push(
      `${this.props.match.url}/${ROUTES.relation}/${k1}/${k2}`
    );
  };

  onEntity1Cleared = () => {
    const k1 = keyForUrl();
    const k2 = keyForUrl(this.props.realKey2);
    this.props.history.push(
      `${this.props.match.url}/${ROUTES.relation}/${k1}/${k2}`
    );
  };

  onEntity2Cleared = () => {
    const k1 = keyForUrl(this.props.realKey1);
    const k2 = keyForUrl();
    this.props.history.push(
      `${this.props.match.url}/${ROUTES.relation}/${k1}/${k2}`
    );
  };

  render() {
    const { realKey1, realKey2, fullyVisible } = this.props;

    return (
      <Container fullyVisible={fullyVisible}>
        <Grid>
          {realKey1 ? (
            <React.Fragment>
              <StyledEntityDetails
                column={1}
                loadFullEntity={fullyVisible}
                big={fullyVisible}
                key={realKey1}
                entityKey={realKey1}
              />
              {fullyVisible && (
                <StyledEntityActions column={1} entityKey={realKey1} />
              )}
            </React.Fragment>
          ) : (
            realKey2 && (
              <StyledEntitySearch
                forceMenuOnTop={true}
                column={1}
                placeholder="Search another..."
                onChange={this.onEntity1Selected}
              />
            )
          )}
          <StyledBigLinksPreview sourceKey={realKey1} targetKey={realKey2} />
          {realKey2 ? (
            <React.Fragment>
              <StyledEntityDetails
                column={3}
                loadFullEntity={fullyVisible}
                big={fullyVisible}
                key={realKey2}
                entityKey={realKey2}
              />
              {fullyVisible && (
                <StyledEntityActions column={3} entityKey={realKey2} />
              )}
            </React.Fragment>
          ) : (
            realKey1 && (
              <StyledEntitySearch
                forceMenuOnTop={true}
                column={3}
                placeholder="Search another..."
                onChange={this.onEntity2Selected}
              />
            )
          )}
        </Grid>
        {!fullyVisible && realKey1 && realKey2 && false && (
          <ClickForFull>
            Click on the relation to show the full details.
          </ClickForFull>
        )}
      </Container>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RelationPreview)
);
