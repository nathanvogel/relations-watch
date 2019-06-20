import React, { FunctionComponent } from "react";
import { RouterProps } from "react-router";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";

import EntitySearch from "../components/EntitySearch";
import ROUTES from "../utils/ROUTES";
import { EntitySelectOption } from "../utils/types";
import R from "../strings/R";
import { PageWidthSizer, PagePadder } from "../styles/sizers";
import EntityDetails from "../components/EntityDetails";
import { media } from "../styles/responsive-utils";
import WebsiteTitle from "../components/titles/WebsiteTitle";
import SecondaryTitle from "../components/titles/SecondaryTitle";
import SetDocumentTitle from "../components/titles/SetDocumentTitle";

const Content = styled.main`
  ${PageWidthSizer}
  ${PagePadder}

  display: flex;
  min-height: calc(100vh - ${props => props.theme.navBarHeight});
  flex-direction: column;
`;

const Bar = styled.div`
  display: inline-block;
  height: ${props => props.theme.navBarHeight};

  position: absolute;
  top: 0px;
  left: ${props => props.theme.appSidebarWidth};
  right: 0px;

  background-color: ${props => props.theme.appBarBG};
`;

const Header = styled.header`
  margin-top: 9vh;
`;

const Article = styled.article`
  flex-grow: 1;
  display: flex;
  flex-flow: row-reverse;
  ${media.tablet`display: block;`}
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

const ItemsSection = styled.section`
  min-width: 250px;
  width: 300px;
  max-width: 40%;
  // margin-top: 2em;
  margin-left: 2.5em;
  // Visual compensation for the drop-shadow
  margin-right: 5px;
  flex-grow: 1;

  ${media.tablet`
    min-width: 100%;
    margin-left: 0;
    width: 100%;
    max-width: 100%;
    `}
`;

const ItemList = styled.div`
  & > * {
    display: block;
    // margin-top: ${props => props.theme.marginTB};
    // margin-bottom: ${props => props.theme.marginTB};
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

const HomeScreen: FunctionComponent<RouterProps> = props => {
  const { t } = useTranslation();

  const onSearch = (searchSelection: EntitySelectOption) => {
    const entityKey = searchSelection.value;
    const url = `/${ROUTES.entity}/${entityKey}`;
    props.history.push(url);
  };

  return (
    <React.Fragment>
      <WebsiteTitle />
      <SetDocumentTitle />
      <Bar />
      <Content>
        <Header>
          {/* <CentralTitle>Explore the relation graph</CentralTitle> */}
          <CentralSearch
            withSearchIcon
            autoFocus
            onChange={onSearch}
            placeholder={t(R.placeholder_explicit_search)}
          />
        </Header>
        <Article>
          <ItemsSection>
            <SecondaryTitle>{t(R.home_trending)}</SecondaryTitle>
            <ItemList>
              <EntityDetails entityKey={"1589920"} />
              <EntityDetails entityKey={"1189326"} />
              <EntityDetails entityKey={"222110"} />
              {/* <EntityDetails entityKey={"1701669"} /> */}
            </ItemList>
          </ItemsSection>
          <div>
            {/* <h2>{t(R.slogan)}</h2> */}
            <SecondaryTitle>{t(R.faq_about_q)}</SecondaryTitle>
            <p>{t(R.faq_about_a)}</p>
            <SecondaryTitle>{t(R.faq_data_q)}</SecondaryTitle>
            <p>
              <Trans i18nKey={R.faq_data_a}>
                <a href="https://www.monde-diplomatique.fr/cartes/PPA" />
              </Trans>
            </p>
          </div>
        </Article>
        <Footer>
          <a href="/?lng=en">EN</a> / <a href="/?lng=fr">FR</a> -{" "}
          <a href="https://github.com/nathanvogel/relations-watch">
            {t(R.source_link_text)}
          </a>
        </Footer>
      </Content>
    </React.Fragment>
  );
};

export default HomeScreen;
