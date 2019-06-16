import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import { Link } from "react-router-dom";

import { RootStore } from "../Store";
import { loadEntity } from "../features/entitiesLoadAC";
import Meta from "../components/meta/Meta";
import { Status, EntityPreview, Entity } from "../utils/types";
import EntityView from "./entity/EntityView";
import EntityName from "./entity/EntityName";

type OwnProps = {
  entityKey: string;
  loadFullEntity?: boolean;
  big?: boolean;
  nameOnly?: boolean;
  className?: string;
};

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { entityKey, loadFullEntity, className, big, nameOnly } = props;
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
    loadFullEntity,
    big,
    nameOnly,
    entityPreview,
    entity,
    status,
    error,
    className,
  };
};
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ loadEntity: loadEntity }, dispatch);
type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class EntityDetails extends Component<Props> {
  componentDidMount() {
    if (
      (!this.props.entityPreview || this.props.loadFullEntity) &&
      (!this.props.status || this.props.status === Status.Error)
    )
      this.props.loadEntity(this.props.entityKey);
  }

  render() {
    const { entity, status, error, big, nameOnly } = this.props;
    const { entityPreview, loadFullEntity, className } = this.props;

    // If we don't need the full entity data, we can directly use the
    // EntityPreview if available
    if (!loadFullEntity && entityPreview)
      return nameOnly ? (
        <EntityName className={className}>{entityPreview.name}</EntityName>
      ) : (
        <Link className={className} to={`/e/${this.props.entityKey}`}>
          <EntityView big={big} entity={entityPreview} />
        </Link>
      );

    // We can't use the EntityPreview, so we might need to render a loading
    // status or error
    if (status !== Status.Ok)
      return <Meta className={className} status={status} error={error} />;
    // TS assert. If Status === Ok and we don't have an entity, then we have
    // a problem
    if (!entity) return <div className={className}>Error</div>;

    return nameOnly ? (
      <EntityName className={className}>{entity.name}</EntityName>
    ) : (
      <Link className={className} to={`/e/${this.props.entityKey}`}>
        <EntityView big={big} entity={entity} />
      </Link>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityDetails);
