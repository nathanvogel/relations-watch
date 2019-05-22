import React, { FunctionComponent, useEffect } from "react";
import { connect } from "react-redux";
import { DatasetId, ImportStage, Entity } from "../utils/types";
import ErrorBox from "../components/meta/ErrorBox";
import styled from "styled-components";
import { Dispatch, AnyAction, bindActionCreators } from "redux";
import { RootStore } from "../Store";
import * as actions from "../features/wikidataAC";
import * as instantActions from "../features/wikidataActions";
import SimilarEntitiesSelector from "../components/dataimport/SimilarEntitiesSelector";
import IconButton from "../components/buttons/IconButton";
import ButtonBar from "../components/buttons/ButtonBar";
import UpdateList from "../components/dataimport/UpdateList";

const Loading = styled.div`
  background: ${props => props.theme.inputBG};
  padding: 8px;
  border-radius: ${props => props.theme.radius};
`;
const Success = styled(Loading)`
  background: ${props => props.theme.successBG};
`;

interface OwnProps {
  datasetId?: DatasetId;
  entityDatasetId?: string;
  onDone?: (newEntity?: Entity) => void;
  autoCreate?: boolean;
}

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { datasetId, entityDatasetId, onDone, autoCreate } = props;
  const data =
    entityDatasetId && state.dataimport[entityDatasetId]
      ? state.dataimport[entityDatasetId]
      : undefined;
  return {
    datasetId,
    entityDatasetId,
    data,
    onDone,
    autoCreate,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      startImport: actions.fetchWikidataGraphAndFamiliarEntities,
      selectSimilarEntity: instantActions.selectSimilarEntity,
      patchSimilarEntities: actions.patchSimilarEntities,
      confirmImport: actions.confirmImport,
    },
    dispatch
  );

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const Importer: FunctionComponent<Props> = props => {
  useEffect(() => {
    if (!props.data && props.entityDatasetId)
      props.startImport(props.entityDatasetId, props.autoCreate ? 0 : 3);

    if (props.data) {
      switch (props.data.importStage) {
        case ImportStage.ImportSuccessful:
          console.log(
            "Import successful: ",
            props.autoCreate,
            props.data.entryEntity,
            props.onDone
          );
          if (props.autoCreate && props.data.entryEntity && props.onDone)
            props.onDone(props.data.entryEntity);
          break;
      }
    }
  });

  if (props.datasetId !== DatasetId.Wikidata)
    return (
      <ErrorBox>
        Importing from datasets other than Wikidata isn't supported on the
        client.
      </ErrorBox>
    );
  if (!props.entityDatasetId)
    return <ErrorBox>Missing ID of the entry point.</ErrorBox>;
  if (!props.data) return <div>Data not loaded</div>;
  if (props.data && props.data.error)
    return <ErrorBox>{props.data.error.eMessage}</ErrorBox>;

  const namespace = props.entityDatasetId;

  switch (props.data.importStage) {
    case ImportStage.Clear:
      return <Loading>We're clear.</Loading>;
    case ImportStage.FetchingDataset:
      return <Loading>Loading from Wikidata...</Loading>;
    case ImportStage.FetchedDataset:
      return <Loading>Data from Wikidata loaded!</Loading>;
    case ImportStage.FetchingSimilarEntities:
      return <Loading>Checking if there're similar entities...</Loading>;
    case ImportStage.FetchedSimilarEntities:
      const buttons = (
        <ButtonBar buttonsAlign="right">
          <IconButton
            withText
            onClick={() => props.patchSimilarEntities(namespace)}
          >
            Merge selected entities
          </IconButton>
        </ButtonBar>
      );
      return (
        <React.Fragment>
          {buttons}
          <SimilarEntitiesSelector
            dsEntities={props.data.dsEntities}
            similarEntities={props.data.similarEntities}
            similarEntitiesSelection={props.data.similarEntitiesSelection}
            selectEntity={(entityKey: string, selection: number) =>
              props.selectSimilarEntity(namespace, entityKey, selection)
            }
          />
          {buttons}
        </React.Fragment>
      );
    case ImportStage.PostingSimilarEntities:
      return <Loading>Saving the selected entities...</Loading>;
    case ImportStage.PostedSimilarEntities:
      return <Loading>Successfully saved!</Loading>;
    case ImportStage.FetchingEntityDiff:
      return <Loading>Loading entities...</Loading>;
    case ImportStage.FetchedEntityDiff:
      return <Loading>Entities received!</Loading>;
    case ImportStage.FetchingEdgeDiff:
      return <Loading>Loading relations...</Loading>;
    case ImportStage.FetchedEdgeDiff:
      return <Loading>Relations received!</Loading>;
    case ImportStage.WaitingForDiffConfirmation:
      const buttons2 = (
        <ButtonBar buttonsAlign="right">
          <IconButton withText onClick={() => props.confirmImport(namespace)}>
            Import all
          </IconButton>
        </ButtonBar>
      );
      return (
        <React.Fragment>
          {buttons2}
          <UpdateList
            dsEntities={props.data.dsEntities}
            existingEdges={props.data.existingEdges}
            edgesToPost={props.data.edgesToPost}
            edgesToPatch={props.data.edgesToPatch}
            existingEntities={props.data.existingEntities}
            entitiesToPost={props.data.entitiesToPost}
            entitiesToPatch={props.data.entitiesToPatch}
          />
          {buttons2}
        </React.Fragment>
      );
    case ImportStage.PostingEntityDiff:
      return <Loading>Saving entities...</Loading>;
    case ImportStage.PostedEntityDiff:
      return <Loading>Saved entities!</Loading>;
    case ImportStage.PostingEdgeDiff:
      return <Loading>Saving edges...</Loading>;
    case ImportStage.PostedEdgeDiff:
      return <Loading>Saved edges!</Loading>;
    case ImportStage.ImportSuccessful:
      return (
        <Success>
          Successfully imported all entities and relations!
          <ButtonBar buttonsAlign="right">
            {props.onDone && (
              <IconButton
                withText
                onClick={() =>
                  props.onDone
                    ? props.onDone(
                        props.data && props.data.entryEntity
                          ? props.data.entryEntity
                          : undefined
                      )
                    : console.log("nope")
                }
              >
                Done
              </IconButton>
            )}
          </ButtonBar>
        </Success>
      );
  }

  return (
    <div>
      Unkown state, you should not be able to see this, please report to the
      developer.
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Importer);
