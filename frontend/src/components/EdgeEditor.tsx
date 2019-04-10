import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import styled from "styled-components";

import { RootStore } from "../Store";
import ROUTES from "../utils/ROUTES";
import { getRelationId } from "../utils/utils";
import { bindActionCreators, Dispatch } from "redux";
import { RootAction } from "../utils/ACTIONS";
import { connect } from "react-redux";
import CONSTS from "../utils/consts";
import EntityName from "./EntityName";
import { RELATION_TYPES } from "../strings/strings";

const Content = styled.div`
  display: block;
  border: grey 1px dotted;
  padding: 12px;
`;

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  min-height: 3em;
  box-sizing: border-box;
`;

const Label = styled.label`
  display: block;
`;

type OwnProps = {
  entity1Key: string;
  entity2Key: string;
  newEdge: boolean;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const entity1Key = props.entity1Key;
  const entity2Key = props.entity2Key;
  const newEdge = props.newEdge;
  const relationId = getRelationId(entity1Key, entity2Key);

  return {
    entity1Key,
    entity2Key,
    newEdge,
    relationId
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators({}, dispatch);

type State = {
  description: string;
  type: number | undefined;
  amount: number;
  exactAmount: boolean;
  jobInvolved: boolean;
  invertDirection: boolean;
};

class RelationsScreen extends React.Component<Props> {
  readonly state: State = {
    description: "",
    type: undefined,
    amount: 0,
    exactAmount: false,
    jobInvolved: false,
    invertDirection: false
  };

  onSecondEntitySelected = (value: string) => {};

  onDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ description: event.target.value });
  };

  onTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ type: event.target.value });
  };

  onJobChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ jobInvolved: event.target.checked });
  };

  onExactAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ exactAmount: event.target.checked });
  };

  onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ amount: event.target.value });
  };

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    alert("An edge was submitted: " + this.state.description);
    event.preventDefault();
  };

  render() {
    const { entity1Key, entity2Key } = this.props;
    const invert = this.state.invertDirection;

    return (
      <Content>
        <form onSubmit={this.onSubmit}>
          <div>
            <EntityName entityKey={invert ? entity2Key : entity1Key} />
            <select value={this.state.type} onChange={this.onTypeChange}>
              {Object.keys(CONSTS.RELATION_TYPES).map(key => (
                <option value={"" + CONSTS.RELATION_TYPES[key]}>
                  {RELATION_TYPES[key]}
                </option>
              ))}
            </select>
            <EntityName entityKey={invert ? entity1Key : entity2Key} />
            <button type="button">Invert direction</button>
          </div>
          <Label>
            Brief and neutral description of this information:
            <TextArea
              value={this.state.description}
              onChange={this.onDescriptionChange}
            />
          </Label>
          <Label>
            <EntityName entityKey={invert ? entity2Key : entity1Key} /> helps{" "}
            <EntityName entityKey={invert ? entity1Key : entity2Key} /> to have
            a job.
            <input
              type="checkbox"
              checked={this.state.jobInvolved}
              onChange={this.onJobChange}
            />
          </Label>
          <Label>
            Amount involved (in US$):
            <input
              type="number"
              value={this.state.amount}
              onChange={this.onAmountChange}
            />
          </Label>
          <Label>
            Exact amount known
            <input
              type="checkbox"
              checked={this.state.exactAmount}
              onChange={this.onExactAmountChange}
            />
          </Label>
          <button type="submit">Save</button>
          <button type="button">Cancel</button>
        </form>
      </Content>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RelationsScreen)
);
