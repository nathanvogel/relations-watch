import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import styled, { css } from "styled-components";

import { RootStore } from "../Store";
import ROUTES from "../utils/ROUTES";
import { media } from "../styles/responsive-utils";
import { connect } from "react-redux";
import EntityDetails from "../components/EntityDetails";
import EntitySearch from "../components/EntitySearch";
import { emptyOrRealKey, keyForUrl } from "../utils/utils";
import { EntitySelectOption } from "../utils/types";
import { loadRelation } from "../features/edgesLoadAC";
import BigLinksPreview from "../components/BigLinksPreview";
import { selectEntities } from "../features/entitySelectionActions";
import { MiniInfoText } from "./titles/MiniInfoText";

const limitedContainerCSS = css`
  height: 100%;
  max-height: 100%;
  overflow: hidden;
`;

interface ContainerProps {
  fullyVisible: boolean;
}
const Container = styled.div<ContainerProps>`
  ${props => (props.fullyVisible ? "" : limitedContainerCSS)}

  display: flex;
  ${media.mobile`
    display: block;
  `}
`;

const EntityColumn = styled.div`
  flex: 1;
`;
const LinksColumn = styled.div`
  flex: 1;
  max-width: 33%;
  ${media.mobile`max-width: 100%;`}
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
      <div>
        <Container fullyVisible={fullyVisible}>
          <EntityColumn>
            {realKey1 ? (
              <EntityDetails
                expanded={fullyVisible}
                key={realKey1}
                entityKey={realKey1}
              />
            ) : (
              realKey2 && (
                <EntitySearch
                  placeholder="Search another..."
                  onChange={this.onEntity1Selected}
                />
              )
            )}
          </EntityColumn>
          <LinksColumn>
            {/* PART links preview */}
            <BigLinksPreview sourceKey={realKey1} targetKey={realKey2} />
          </LinksColumn>
          <EntityColumn>
            {realKey2 ? (
              <EntityDetails
                expanded={fullyVisible}
                key={realKey2}
                entityKey={realKey2}
              />
            ) : (
              realKey1 && (
                <EntitySearch
                  placeholder="Search another..."
                  onChange={this.onEntity2Selected}
                />
              )
            )}
          </EntityColumn>
        </Container>
        {!fullyVisible && realKey1 && realKey2 && (
          <ClickForFull>
            Click on the relation to show the full details.
          </ClickForFull>
        )}
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RelationPreview)
);
