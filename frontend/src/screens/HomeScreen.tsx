import React, { FunctionComponent } from "react";
import { RouterProps } from "react-router";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";

import EntitySearch from "../components/EntitySearch";
import ROUTES from "../utils/ROUTES";
import { ReactSelectOption } from "../utils/types";
import R from "../strings/R";
import { PageWidthSizer, PagePadder } from "../styles/sizers";

const Content = styled.main`
  ${PageWidthSizer}
  ${PagePadder}

  display: flex;
  min-height: calc(100vh - ${props => props.theme.navBarHeight});
  flex-direction: column;
`;

const Header = styled.header`
  margin-top: 16vh;
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
  width: 330px;
  max-width: 100%;
  margin: 0 auto;
  margin-bottom: 12vh;

  .rs__control {
    padding: 4px ${props => props.theme.inputPaddingLR};
  }
`;

const CentralTitle = styled.h2`
  text-align: center;
  font-size: 24px;
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
        <CentralTitle>Explore the relation graph</CentralTitle>
        <CentralSearch onChange={onSearch} />
      </Header>
      <Article>
        <h2>{t(R.slogan)}</h2>
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
