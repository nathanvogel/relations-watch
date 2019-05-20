import React, { FunctionComponent, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import EntityEditor from "../components/EntityEditor";
import { connect } from "react-redux";
import { DatasetId, ImportStage } from "../utils/types";
import ErrorBox from "../components/meta/ErrorBox";
import styled from "styled-components";
import { PageWidthSizer, PagePadder } from "../styles/sizers";
import { Dispatch, AnyAction, bindActionCreators } from "redux";
import { RootStore } from "../Store";
import * as actions from "../features/wikidataAC";
import * as instantActions from "../features/wikidataActions";
import SimilarEntitiesSelector from "../components/dataimport/SimilarEntitiesSelector";
import IconButton from "../components/buttons/IconButton";
import ButtonBar from "../components/buttons/ButtonBar";
import UpdateList from "../components/dataimport/ UpdateList";

const Content = styled.div`
  ${PageWidthSizer}
  ${PagePadder}
`;
const Loading = styled.div`
  background: ${props => props.theme.inputBG};
  padding: 8px;
  border-radius: ${props => props.theme.radius};
`;

interface DataimportMatch {
  datasetId?: DatasetId;
  entityDatasetId?: string;
}

const mapStateToProps = (state: RootStore, props: RouteComponentProps) => {
  const { datasetId, entityDatasetId } = props.match.params as DataimportMatch;
  const data =
    entityDatasetId && state.dataimport[entityDatasetId]
      ? state.dataimport[entityDatasetId]
      : undefined;
  return {
    datasetId,
    entityDatasetId,
    data
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      startImport: actions.fetchWikidataGraphAndFamiliarEntities,
      selectSimilarEntity: instantActions.selectSimilarEntity,
      patchSimilarEntities: actions.patchSimilarEntities
    },
    dispatch
  );

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const ImportScreen: FunctionComponent<Props> = props => {
  useEffect(() => {
    if (!props.data && props.entityDatasetId)
      props.startImport(props.entityDatasetId);
    // if (props.data) {
    //   switch(props.data.importStage) {
    //     case
    //   }
    // }
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
      return (
        <UpdateList
          dsEntities={props.data.dsEntities}
          existingEdges={props.data.existingEdges}
          edgesToPost={props.data.edgesToPost}
          edgesToPatch={props.data.edgesToPatch}
          existingEntities={props.data.existingEntities}
          entitiesToPost={props.data.entitiesToPost}
          entitiesToPatch={props.data.entitiesToPatch}
        />
      );

    // TODO:
    /*
       PostingEntityDiff,
       PostedEntityDiff,
       PostingEdgeDiff,
       PostedEdgeDiff */
  }

  return <div />;
};

const ImportScreenWrapper: FunctionComponent<Props> = props => (
  <Content>
    <ImportScreen {...props} />
  </Content>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportScreenWrapper);
