import React, { FunctionComponent } from "react";
import { Entity, Edge, Dictionary } from "../../utils/types";
import styled from "styled-components";
import BaseImportEntity from "./BaseImportEntity";
import { media } from "../../styles/media-styles";
import EdgeSummary from "../edgeDetails/EdgeSummary";
import ErrorBox from "../meta/ErrorBox";

const Row = styled.div`
  margin: ${props => props.theme.marginTB} 0;
  padding-bottom: ${props => props.theme.marginTB};
  border-bottom: solid 1px ${props => props.theme.lightBG};
`;

type ItemListProps = {
  existing?: boolean;
};

const ItemList = styled.div<ItemListProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  ${props => props.existing && "opacity: 0.5;"}

  & > * {
    min-width: 16em;
    width: calc(25% - 28px);
    margin-right: ${props => props.theme.marginLR};
    margin-top: ${props => props.theme.marginTB};
    margin-bottom: ${props => props.theme.marginTB};
    ${media.mobile`width: 100%;`}
  }
`;

const EdgeItemList = styled(ItemList)`
  & > * {
    max-width: calc(50% - 28px);
    height: 100%;
  }
`;

type Props = {
  dsEntities: Dictionary<Entity>;
  existingEntities: Entity[];
  entitiesToPatch: Entity[];
  entitiesToPost: Entity[];
  existingEdges: Edge[];
  edgesToPatch: Edge[];
  edgesToPost: Edge[];
};

const UpdateList: FunctionComponent<Props> = props => {
  const renderEdge = (edge: Edge, index: number) =>
    props.dsEntities[edge._to] && props.dsEntities[edge._from] ? (
      <EdgeSummary
        key={index}
        edge={edge}
        entityFrom={props.dsEntities[edge._from]}
        entityTo={props.dsEntities[edge._to]}
        alsoOther
      />
    ) : (
      <ErrorBox key={index}>
        Relation {edge.ds ? edge.ds.wd : edge._from + "-" + edge._to}: missing
        entity {edge._from} or {edge._to}
      </ErrorBox>
    );
  const renderEntity = (entity: Entity, index: number) => (
    <BaseImportEntity key={index} entity={entity} />
  );

  return (
    <div>
      {props.entitiesToPost.length > 0 && (
        <Row>
          <p>
            These {props.entitiesToPost.length} new entities will be created.
          </p>
          <ItemList>{props.entitiesToPost.map(renderEntity)}</ItemList>
        </Row>
      )}
      {props.entitiesToPatch.length > 0 && (
        <Row>
          <p>
            These {props.entitiesToPatch.length} entities will be{" "}
            <em>modified</em>.
          </p>
          <ItemList>{props.entitiesToPatch.map(renderEntity)}</ItemList>
        </Row>
      )}
      {props.existingEntities.length > 0 && (
        <Row>
          <p>
            These {props.existingEntities.length} entities already exists in the
            database.
          </p>
          <ItemList existing>
            {props.existingEntities.map(renderEntity)}
          </ItemList>
        </Row>
      )}
      {props.edgesToPost.length > 0 && (
        <Row>
          <p>These {props.edgesToPost.length} new relations will be created.</p>
          <EdgeItemList>{props.edgesToPost.map(renderEdge)}</EdgeItemList>
        </Row>
      )}
      {props.edgesToPatch.length > 0 && (
        <Row>
          <p>
            These {props.edgesToPatch.length} relations will be{" "}
            <em>modified</em>.
          </p>
          <EdgeItemList>{props.edgesToPatch.map(renderEdge)}</EdgeItemList>
        </Row>
      )}
      {props.existingEdges.length > 0 && (
        <Row>
          <p>These {props.existingEdges.length} relations already exists.</p>
          <EdgeItemList existing>
            {props.existingEdges.map(renderEdge)}
          </EdgeItemList>
        </Row>
      )}
    </div>
  );
};

export default UpdateList;
