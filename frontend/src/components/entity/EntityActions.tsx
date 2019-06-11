import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { Entity, DatasetId } from "../../utils/types";
import { IconButtonLink } from ".././buttons/IconButton";
import { ReactComponent as EditIcon } from "../../assets/ic_edit.svg";
import ROUTES from "../../utils/ROUTES";
import SmallA, { SmallLink } from ".././buttons/SmallA";
import ButtonBar from ".././buttons/ButtonBar";
import { RootStore } from "../../Store";

const ActionLinksBox = styled.div`
  margin-top: ${props => props.theme.marginTB};

  & > * {
    display: block;
  }
`;

type OwnProps = {
  entityKey: string;
  className?: string;
};

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const entity = state.entities.data[props.entityKey] as Entity | undefined;
  return {
    ...props,
    entity,
  };
};
const mapDispatchToProps = () => ({});
type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

/**
 * Another component should take care of of loading the entity and display
 * its status.
 */
class EntityActions extends React.PureComponent<Props> {
  render() {
    const { entity, className } = this.props;
    if (!entity) return null;

    return entity.ds && entity.ds.wd ? (
      <ActionLinksBox className={className}>
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
      <ButtonBar className={className}>
        <IconButtonLink to={`/${ROUTES.edit}/${ROUTES.entity}/${entity._key}`}>
          <EditIcon />
        </IconButtonLink>
      </ButtonBar>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityActions);
