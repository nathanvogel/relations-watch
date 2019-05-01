import React from "react";
import styled from "styled-components";
import { RootStore } from "../Store";
import Button from "./buttons/Button";

type OwnProps = {
  sourceKey: string;
  onCancelClick: () => void;
};

// const mapStateToProps = (state: RootStore, props: OwnProps) => {
//   const source = state.
// }

class SourceDetails extends React.Component<OwnProps> {
  render() {
    return (
      <div>
        <strong>Source {this.props.sourceKey}</strong>
        <Button onClick={this.props.onCancelClick}>Pick another source</Button>
      </div>
    );
  }
}

export default SourceDetails;
