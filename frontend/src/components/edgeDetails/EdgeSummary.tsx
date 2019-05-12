import React from "react";
import { useTranslation } from "react-i18next";

import { RelationType, Entity } from "../../utils/types";

type Props = {
  relationType: RelationType;
  entityFrom: Entity;
  entityTo: Entity;
};

const EdgeSummary: React.FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  return (
    <span>
      {t("relationType_worksFor", {
        nameFrom: props.entityFrom.name,
        nameTo: props.entityTo.name
      })}
    </span>
  );
};

export default EdgeSummary;
