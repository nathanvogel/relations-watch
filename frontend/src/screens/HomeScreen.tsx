import React, { FunctionComponent } from "react";
import { RouterProps } from "react-router";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";

import EntitySearch from "../components/EntitySearch";
import ROUTES from "../utils/ROUTES";
import { ReactSelectOption } from "../utils/types";
import R from "../strings/R";
import { PageWidthSizer, PagePadder } from "../styles/sizers";
import EntityDetails from "../components/EntityDetails";
import { media } from "../styles/media-styles";

const Content = styled.main`
  ${PageWidthSizer}
  ${PagePadder}

  display: flex;
  min-height: calc(100vh - ${props => props.theme.navBarHeight});
  flex-direction: column;
`;

const Header = styled.header`
  margin-top: 12vh;
`;

const Article = styled.article`
  flex-grow: 1;
`;

const Footer = styled.footer`
  min-height: 2em;
  margin-top: 1em;
`;

const CentralSearch = styled(EntitySearch)`
  font-size: 22px;
  display: block;
  width: 420px;
  max-width: 100%;
  margin: 0 auto;
  margin-bottom: 9vh;

  .rs__control {
    padding: 4px ${props => props.theme.inputPaddingLR};
  }
`;

const CentralTitle = styled.h2`
  text-align: center;
  font-size: 24px;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  // overflow: auto;
  // white-space: nowrap;
  // margin-top: -18px;

  & > * {
    display: inline-block;
    min-width: 12em;
    max-width: 19em;
    margin-right: ${props => props.theme.marginLR};
    margin-top: ${props => props.theme.marginTB};
    margin-bottom: ${props => props.theme.marginTB};
    ${media.mobile`width: 100%;`}

    > div {
      height: calc(
        100% - ${props => props.theme.inputPaddingTB} -
          ${props => props.theme.inputPaddingTB}
      );
    }
  }
`;

const Trending = styled.p`
  color: ${props => props.theme.secondaryTextColor};
  margin-bottom: 2px;
  text-transform: uppercase;
  font-size: ${props => props.theme.fontSizeS};
`;

const HomeScreen: FunctionComponent<RouterProps> = props => {
  const { t } = useTranslation();

  const onSearch = (searchSelection: ReactSelectOption) => {
    const entityKey = searchSelection.value;
    const url = `/${ROUTES.entity}/${entityKey}`;
    props.history.push(url);
  };

  return (
    <Content>
      <Header>
        {/* <CentralTitle>Explore the relation graph</CentralTitle> */}
        <CentralSearch autoFocus onChange={onSearch} />
      </Header>
      <Article>
        <Trending>{t(R.home_trending)}</Trending>
        <ItemList>
          <EntityDetails entityKey={"1539778"} />
          <EntityDetails entityKey={"1589920"} />
          <EntityDetails entityKey={"222110"} />
          {/* <EntityDetails entityKey={"1701669"} /> */}
        </ItemList>
        <br />
        {/* <h2>{t(R.slogan)}</h2> */}
        <h3>{t(R.faq_about_q)}</h3>
        <p>{t(R.faq_about_a)}</p>
        <h3>{t(R.faq_data_q)}</h3>
        <p>
          <Trans i18nKey={R.faq_data_a}>
            <a href="https://www.monde-diplomatique.fr/cartes/PPA" />
          </Trans>
        </p>
      </Article>
      <Footer>
        <a href="/?lng=en">EN</a> / <a href="/?lng=fr">FR</a>
      </Footer>
    </Content>
  );
};

export default HomeScreen;
