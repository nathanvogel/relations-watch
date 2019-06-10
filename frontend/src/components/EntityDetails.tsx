import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import { Link } from "react-router-dom";

import { RootStore } from "../Store";
import { loadEntity } from "../features/entitiesLoadAC";
import Meta from "../components/meta/Meta";
import { Status, EntityPreview, Entity, DatasetId } from "../utils/types";
import EntityView from "./entity/EntityView";
import IconButton, { IconButtonLink } from "./buttons/IconButton";
import { ReactComponent as EditIcon } from "../assets/ic_edit.svg";
import ROUTES from "../utils/ROUTES";
import SmallA, { SmallLink } from "./buttons/SmallA";
import ButtonBar from "./buttons/ButtonBar";

const ActionLinksBox = styled.div`
  margin-top: ${props => props.theme.inputTBSpacing};

  & > * {
    display: block;
  }
`;

type OwnProps = {
  entityKey: string;
  expanded?: boolean;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { entityKey, expanded } = props;
  // Get the entity from the Redux Store
  const entityPreview = state.entities.datapreview[entityKey] as
    | EntityPreview
    | undefined;
  const entity = state.entities.data[entityKey] as Entity | undefined;
  const status = state.entities.status[entityKey];
  const error = state.entities.errors[entityKey];
  // Return everything.
  return {
    entityKey,
    expanded,
    entityPreview,
    entity,
    status,
    error,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      loadEntity: loadEntity,
    },
    dispatch
  );

class EntityDetails extends Component<Props> {
  componentDidMount() {
    if (
      (!this.props.entityPreview || this.props.expanded) &&
      (!this.props.status || this.props.status === Status.Error)
    )
      this.props.loadEntity(this.props.entityKey);
  }

  render() {
    const { entity, entityPreview, status, error, expanded } = this.props;

    // If we don't need the full entity data, we can directly use the
    // EntityPreview if available
    if (!expanded && entityPreview)
      return (
        <Link to={`/e/${this.props.entityKey}`}>
          <EntityView entity={entityPreview} />
        </Link>
      );

    // We can't use the EntityPreview, so we might need to render a loading
    // status or error
    if (status !== Status.Ok) return <Meta status={status} error={error} />;
    // TS assert. If Status === Ok and we don't have an entity, then we have
    // a problem
    if (!entity) return "Error";

    // Render either the simple preview, or the full view with edit control
    // at this point.
    const entityView = (
      <Link to={`/e/${this.props.entityKey}`}>
        <EntityView entity={entity} />
      </Link>
    );

    if (!expanded) return entityView;
    else
      return (
        <div>
          {entityView}
          {entity.ds && entity.ds.wd ? (
            <ActionLinksBox>
              <SmallA href={`https://www.wikidata.org/wiki/${entity.ds.wd}`}>
                Edit on Wikidata
              </SmallA>
              <SmallLink
                to={`/${ROUTES.import}/${DatasetId.Wikidata}/${entity.ds.wd}`}
              >
                Auto-update from Wikidata
              </SmallLink>
            </ActionLinksBox>
          ) : (
            <div>
              <ButtonBar>
                <IconButtonLink
                  to={`/${ROUTES.edit}/${ROUTES.entity}/${entity._key}`}
                >
                  <EditIcon />
                </IconButtonLink>
              </ButtonBar>
            </div>
          )}
        </div>
      );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityDetails);
