import React, { Component, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, AnyAction } from "redux";

import { RootStore } from "../Store";
import { loadEntity } from "../features/entitiesLoadAC";
import { loadEntityGraph } from "../features/linksLoadAC";
import * as entitySelectionActions from "../features/entitySelectionActions";
import { withTranslation, WithTranslation } from "react-i18next";
import GraphContainerV4 from "../components/GraphContainerV4";
import { ErrorPayload, Status, Entity } from "../utils/types";
import { arrayWithoutDuplicates } from "../utils/utils";
import Meta from "../components/meta/Meta";

const Content = styled.div`
  position: relative;
  overflow: hidden;
`;

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithTranslation;

const selections = {
  benalla: [
    "1991650",
    "1596059",
    "1595278",
    "1595373",
    "1572516",
    "1536437",
    "1589920",
    "1596198",
    "1990481",
    "1989895",
  ],
  mediasfrancais: arrayWithoutDuplicates([
    "1189568",
    "1189516",
    "1189502",
    "1189268",
    "1189598",
    "1189828",
    "1189448",
    "1189774",
    "1189318",
    "1189284",
    "1189456",
    "1189596",
    "1189640",
    "1189258",
    "1189492",
    "1189780",
    "1189320",
    "1189386",
    "1189768",
    "1189646",
    "1189358",
    "1189458",
    "1189326",
    "1189452",
    "1189864",
    "1189758",
    "1189614",
    "1189494",
    "1189636",
    "1189416",
    "1189292",
    "1189602",
    "1189476",
    "1189380",
    "1189802",
    "1189736",
    "1189406",
    "1189882",
    "1189710",
    "1189674",
    "1189280",
    "1189534",
    "1189532",
    "1189368",
    "1189400",
    "1189382",
    "1189834",
    "1189278",
    "1189762",
    "1189740",
    "1189714",
    "1189304",
    "1189654",
    "1189472",
    "1189378",
    "1189390",
    "1189782",
    "1189434",
    "1189610",
    "1189712",
    "1189442",
    "1189330",
    "1189716",
    "1189510",
    "1189694",
    "1189446",
    "1189520",
    "1189338",
    "1189384",
    "1189840",
    "1189564",
    "1189294",
    "1189342",
    "1189656",
    "1189738",
    "1189626",
    "1189650",
    "1189392",
    "1189622",
    "1189462",
    "1189366",
    "1189486",
    "1189450",
    "1189804",
    "1189824",
    "1189836",
    "1189254",
    "1189672",
    "1189832",
    "1189604",
    "1189748",
    "1189398",
    "1189776",
    "1189410",
    "1189696",
    "1189660",
    "1189396",
    "1189548",
    "1189418",
    "1189800",
    "1189868",
    "1189440",
    "1189438",
    "1189676",
    "1189388",
    "1189690",
    "1189642",
    "1189336",
    "1189606",
    "1189362",
    "1189750",
    "1189634",
    "1189664",
    "1189290",
    "1189566",
    "1189730",
    "1189270",
    "1189724",
    "1189874",
    "1189734",
    "1189414",
    "1189500",
    "1189556",
    "1189314",
    "1189282",
    "1189256",
    "1189812",
    "1189506",
    "1189572",
    "1189592",
    "1189276",
    "1189838",
    "1189618",
    "1189404",
    "1189570",
    "1189818",
    "1189846",
    "1189808",
    "1189820",
    "1189286",
    "1189328",
    "1189688",
    "1189880",
    "1189830",
    "1189546",
    "1189786",
    "1189484",
    "1189408",
    "1189662",
    "1189684",
    "1189542",
    "1189550",
    "1189778",
    "1189878",
    "1189590",
    "1189772",
    "1189798",
    "1189436",
    "1189700",
    "1189670",
    "1189248",
    "1189464",
    "1189344",
    "1189850",
    "1189466",
    "1189302",
    "1189794",
    "1189428",
    "1189538",
    "1189300",
    "1189420",
    "1189666",
    "1189706",
    "1189876",
    "1189718",
    "1189586",
    "1189746",
    "1189544",
    "1189454",
    "1189784",
    "1189722",
    "1189612",
    "1189708",
    "1189252",
    "1189426",
    "1189638",
    "1189588",
    "1189530",
    "1189732",
    "1189468",
    "1189756",
    "1189682",
    "1189854",
    "1189540",
    "1189826",
    "1189360",
    "1189584",
    "1189620",
    "1189816",
    "1189346",
    "1189518",
    "1189288",
    "1189514",
    "1189340",
    "1189356",
    "1189402",
    "1189560",
    "1189298",
    "1189632",
    "1189810",
    "1189754",
    "1189554",
    "1189726",
    "1189760",
    "1189702",
    "1189370",
    "1189574",
    "1189504",
    "1189814",
    "1189512",
    "1189364",
    "1189692",
    "1189316",
    "1189624",
    "1189524",
    "1189630",
    "1189608",
    "1189594",
    "1189322",
    "1189274",
    "1189728",
    "1189470",
    "1189842",
    "1189792",
    "1189332",
    "1189788",
    "1189686",
    "1189668",
    "1189766",
    "1189764",
    "1189752",
    "1189744",
    "1189704",
    "1189576",
    "1189698",
    "1189648",
    "1189644",
    "1189490",
    "1189246",
    "1189628",
    "1189616",
    "1189536",
    "1189488",
    "1189482",
    "1189478",
    "1189526",
    "1189522",
    "1189372",
    "1189528",
    "1189354",
    "1189658",
    "1189312",
    "1189266",
    "1189600",
    "1189460",
    "1189250",
    "1189272",
    "1189432",
    "1189856",
    "1189334",
    "1189844",
    "1189558",
    "1189508",
    "1189564",
    "1189506",
    "1189496",
    "1189266",
    "1189586",
    "1189824",
    "1189446",
    "1189772",
    "1189314",
    "1189272",
    "1189452",
    "1189608",
    "1189326",
    "1189484",
    "1189380",
    "1189764",
    "1189356",
    "1189324",
    "1189448",
    "1189860",
    "1189744",
    "1189414",
    "1189606",
    "1189474",
    "1189378",
    "1189798",
    "1189734",
    "1189402",
    "1189244",
    "1189712",
    "1189654",
    "1189510",
    "1189362",
    "1189398",
    "1189828",
    "1189652",
    "1189460",
    "1189376",
    "1189432",
    "1189306",
    "1189682",
    "1189348",
    "1189436",
    "1189426",
    "1189444",
    "1189508",
    "1189336",
    "1189830",
    "1189562",
    "1189680",
    "1189822",
    "1189248",
    "1189580",
    "1189396",
    "1189394",
    "1189498",
    "1189416",
    "1189792",
    "1189866",
    "1189434",
    "1189582",
    "1189722",
    "1189262",
    "1189870",
    "1189412",
    "1189554",
    "1189312",
    "1189808",
    "1189604",
    "1189298",
    "1189826",
    "1189806",
    "1189260",
    "1189600",
    "1189872",
    "1189550",
    "1189268",
    "1189482",
    "1189548",
    "1189354",
    "1189770",
    "1189790",
    "1189848",
    "1189796",
    "1189422",
    "1189874",
    "1189584",
    "1189720",
    "1189246",
    "1189424",
    "1189678",
    "1189852",
    "1189308",
    "1189578",
    "1189350",
    "1189296",
    "1189862",
    "1189552",
    "1189858",
    "1189512",
    "1189270",
    "1189868",
    "1189794",
    "1189742",
    "1189374",
    "1189480",
    "1189476",
    "1189352",
    "1189310",
    "1189264",
    "1189500",
    "1189450",
    "1189430",
    "1189854",
  ]),
  trumpfamily: [
    "1585177",
    "1585179",
    "1585171",
    "1585259",
    "1585175",
    "1585173",
    "1585163",
    "1585151",
    "571186",
    "1585153",
    "1585155",
    "1585161",
    "1585165",
    "222110",
    "1585143",
    "1585193",
    "1585137",
    "1585139",
    "1585145",
    "1585149",
    "1585133",
    "728123",
    "1585211",
    "728328",
    "728189",
    "728259",
    "727881",
    "726702",
    "1585141",
    "571598",
    "571755",
    "727169",
  ],
};

const mapStateToProps = (state: RootStore, props: RouteComponentProps) => {
  const entitySelection = state.entitySelection;
  return {
    entitySelection,
    allEntities: state.entities,
    allLinks: state.links,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      loadEntity,
      loadEntityGraph,
      selectEntities: entitySelectionActions.selectEntities,
    },
    dispatch
  );

const HistoryScreen: React.FunctionComponent<Props> = props => {
  const { entitySelection, allEntities, allLinks } = props;
  // Only load if the entitySelection props change
  useEffect(() => {
    for (let key of entitySelection) {
      if (!allEntities.status[key] || allEntities.status[key] === Status.Error)
        props.loadEntity(key);
      if (!allLinks.status[key] || allLinks.status[key] === Status.Error)
        props.loadEntityGraph(key);
    }
  }, [entitySelection]);

  for (let key of entitySelection) {
    if (
      allEntities.status[key] === Status.Requested ||
      allLinks.status[key] === Status.Requested
    )
      return <Meta status={Status.Requested} />;
  }
  return (
    <Content>
      <GraphContainerV4 entityKeys={entitySelection} />
    </Content>
  );
};

export default withTranslation()(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(HistoryScreen)
  )
);