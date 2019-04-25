import React from "react";
import styled from "styled-components";

import SourceRefSearch from "./sourceRefEditor/SourceRefSearch";
import api from "../../utils/api";

type Props = {
  sourceRef: string;
  onSourceRefChange: (value: string) => void;
  onCreateRef: (value: string) => void;
};

const Label = styled.label`
  display: block;
`;

class SourceRefEditor extends React.Component<Props> {
  render() {
    const { sourceRef } = this.props;
    return (
      <Label>
        Source document:
        <SourceRefSearch
          inputValue={sourceRef}
          onInputChange={this.props.onSourceRefChange}
          onCreateRef={this.props.onCreateRef}
        />
      </Label>
    );
  }
}

export default SourceRefEditor;
