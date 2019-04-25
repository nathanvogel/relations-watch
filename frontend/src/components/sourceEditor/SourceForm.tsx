import React from "react";
import styled from "styled-components";

import { Source } from "../../utils/types";

type Props = {
  initialSource: Source;
};

const Label = styled.label`
  display: block;
`;

class SourceForm extends React.Component<Props> {
  static defaultProps = {
    initialSource: {
      ref: "",
      type: 1,
      authors: [],
      fullUrl: "",
      description: "",
      title: "",
      rootDomain: "",
      domain: ""
    }
  };

  readonly state = {
    ref: this.props.initialSource.ref,
    type: this.props.initialSource.type,
    authors: this.props.initialSource.authors,
    fullUrl: this.props.initialSource.fullUrl,
    description: this.props.initialSource.description,
    title: this.props.initialSource.title,
    rootDomain: this.props.initialSource.rootDomain,
    domain: this.props.initialSource.domain
  };

  render() {
    return <span>Source document: {this.state.ref}</span>;
  }
}

export default SourceForm;
