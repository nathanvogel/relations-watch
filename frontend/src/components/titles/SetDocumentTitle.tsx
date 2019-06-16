import React from "react";

type Props = {
  children?: string;
};

const SetDocumentTitle: React.FunctionComponent<Props> = props => {
  let title = "relations.watch";
  if (props.children) title = props.children + " - relations.watch";
  document.title = title;
  return null;
};

export default SetDocumentTitle;
