import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
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
import { postEdge } from "../features/relationsActionCreators";
import { Edge, Status } from "../utils/types";

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
  editorId: string;
  newEdge: boolean;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const entity1Key = props.entity1Key;
  const entity2Key = props.entity2Key;
  const newEdge = props.newEdge;
  const editorId = props.editorId;
  // It's safe to assume we'll get an ID because entity1Key and entity2Key
  // are not nullable.
  const relationId = getRelationId(entity1Key, entity2Key) as string;
  // Get the POST request state from the Redux Store
  const status = state.requests.status[editorId];
  const error = state.requests.errors[editorId];

  return {
    entity1Key,
    entity2Key,
    newEdge,
    editorId,
    relationId,
    status,
    error
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      postEdge
    },
    dispatch
  );

type State = {
  text: string;
  type: number | undefined;
  amount: number;
  exactAmount: boolean;
  jobInvolved: boolean;
  invertDirection: boolean;
};

class RelationsScreen extends React.Component<Props> {
  readonly state: State = {
    text: "",
    type: undefined,
    amount: 0,
    exactAmount: false,
    jobInvolved: false,
    invertDirection: false
  };

  onDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ text: event.target.value });
  };

  onTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ type: +event.target.value });
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
    event.preventDefault();
    if (!this.state.type) return;

    const { entity1Key, entity2Key } = this.props;
    const invert = this.state.invertDirection;
    const edge: Edge = {
      _from: invert ? entity2Key : entity1Key,
      _to: invert ? entity1Key : entity2Key,
      text: this.state.text,
      type: this.state.type,
      amount: this.state.amount,
      exactAmount: this.state.exactAmount,
      job: this.state.jobInvolved,
      sources: []
    };
    this.props.postEdge(edge, this.props.editorId);
  };

  render() {
    const { entity1Key, entity2Key } = this.props;
    const invert = this.state.invertDirection;
    const { status, error } = this.props;

    // Render loading status and error.
    if (status === Status.Ok)
      return (
        <Content>
          <p>Saved!</p>
          <Link to={`/${ROUTES.relation}/${entity1Key}/${entity2Key}`}>Ok</Link>
        </Content>
      );

    return (
      <Content>
        <form onSubmit={this.onSubmit}>
          <div>
            <EntityName entityKey={invert ? entity2Key : entity1Key} />
            <select value={this.state.type} onChange={this.onTypeChange}>
              {Object.keys(CONSTS.RELATION_TYPES).map(key => (
                <option key={key} value={CONSTS.RELATION_TYPES[key]}>
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
              value={this.state.text}
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
          {status === Status.Requested ? <p>Saving...</p> : null}
          {status === Status.Error ? <p>Error: {error.eMessage}</p> : null}
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
