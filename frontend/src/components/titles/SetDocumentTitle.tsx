import React from "react";

type Props = {
  children?: string;
};

const SetDocumentTitle: React.FunctionComponent<Props> = props => {
  let title = "Relations.watch";
  if (props.children) title = props.children + " - Relations.watch";
  document.title = title;
  return null;
};

export default SetDocumentTitle;
