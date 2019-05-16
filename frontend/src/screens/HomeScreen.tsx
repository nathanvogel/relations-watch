import React, { Component, FunctionComponent } from "react";
import { RouterProps } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";

import EntitySearch from "../components/EntitySearch";
import ROUTES from "../utils/ROUTES";
import { ReactSelectOption } from "../utils/types";
import { TP } from "../utils/theme";
import R from "../strings/R";

const Header = styled.header`
  margin-top: 16vh;
`;

const Footer = styled.footer``;

const CentralSearch = styled(EntitySearch)`
  font-size: 22px;
  display: block;
  width: 330px;
  max-width: 100%;
  margin: 0 auto;
  margin-bottom: 12vh;

  .rs__control {
    padding: 4px ${(props: TP) => props.theme.inputPaddingLR};
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
    <div>
      <Header>
        <CentralTitle>Explore the relation graph</CentralTitle>
        <CentralSearch onChange={onSearch} />
        <h2>{t(R.slogan)}</h2>
        <h3>{t(R.faq_about_q)}</h3>
        <p>{t(R.faq_about_a)}</p>
        <h3>{t(R.faq_data_q)}</h3>
        <p>
          <Trans i18nKey={R.faq_data_a}>
            <a href="https://www.monde-diplomatique.fr/cartes/PPA" />
          </Trans>
        </p>
      </Header>
      <Footer>
        <a href="/?lng=en">EN</a> / <a href="/?lng=fr">FR</a>
      </Footer>
    </div>
  );
};

export default HomeScreen;
