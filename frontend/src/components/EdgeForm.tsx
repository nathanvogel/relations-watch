import React from "react";
import styled from "styled-components";

import CONSTS from "../utils/consts";
import EntityName from "./EntityName";
import { RELATION_TYPES_STRRES } from "../strings/strings";
import { Edge, SourceComment, SourceType } from "../utils/types";
import ButtonWithConfirmation from "./ButtonWithConfirmation";
import SourceEditor from "./SourceEditor";
import cuid from "cuid";
import SourceDetails from "./SourceDetails";

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

type Props = {
  entity1Key: string;
  entity2Key: string;
  onFormSubmit: (edge: Edge, comment: SourceComment) => void;
  onDelete: () => void;
  disabled: boolean;
  initialEdge: Edge;
};

type State = {
  text: string;
  type: number | undefined;
  amount?: number;
  exactAmount?: boolean;
  comment: string;
  sourceKey?: string;
  invertDirection: boolean;
};

class EdgeForm extends React.Component<Props> {
  static defaultProps = {
    initialEdge: {
      text: "",
      type: undefined,
      amount: 0,
      exactAmount: false,
      sourceText: ""
    }
  };

  readonly state: State = {
    text: this.props.initialEdge.text,
    type: this.props.initialEdge.type,
    amount: this.props.initialEdge.amount,
    exactAmount: this.props.initialEdge.exactAmount,
    comment: "",
    sourceKey: undefined,
    invertDirection: false
  };

  sourceEditorId = cuid.slug();

  onDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ text: event.target.value });
  };

  onTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ type: +event.target.value });
  };

  toggleInvert = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ invertDirection: !this.state.invertDirection });
  };

  onExactAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ exactAmount: event.target.checked });
  };

  onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ amount: event.target.value });
  };

  onCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ comment: event.target.value });
  };

  onSourceSelected = (sourceKey: string) => {
    this.setState({ sourceKey });
  };

  onSourceDeselected = () => {
    this.setState({ sourceKey: undefined });
  };

  onRefutingSubmit = (event: React.MouseEvent) => {
    this.submit(false);
  };

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.submit(true);
  };

  submit = (confirms: boolean) => {
    // Validate data.
    if (!this.state.type) return;

    const { entity1Key, entity2Key } = this.props;
    const invert = this.state.invertDirection;
    const edge: Edge = {
      _key: this.props.initialEdge._key,
      _from: invert ? entity2Key : entity1Key,
      _to: invert ? entity1Key : entity2Key,
      text: this.state.text,
      type: this.state.type,
      amount: this.state.amount,
      exactAmount: this.state.exactAmount,
      sourceText: this.props.initialEdge.sourceText,
      sources: []
    };
    const comment: SourceComment = {
      comment: this.state.comment,
      type: confirms ? SourceType.Confirms : SourceType.Refutes
    };
    this.props.onFormSubmit(edge, comment);
  };

  render() {
    const { entity1Key, entity2Key, initialEdge } = this.props;
    const invert = this.state.invertDirection;
    const isNew = !Boolean(this.props.initialEdge._key);

    return (
      <Content>
        <form onSubmit={this.onSubmit}>
          <div>
            <EntityName entityKey={invert ? entity2Key : entity1Key} />
            <select value={this.state.type} onChange={this.onTypeChange}>
              <option key="empty" />
              {Object.keys(CONSTS.RELATION_TYPES).map(key => (
                <option key={key} value={CONSTS.RELATION_TYPES[key]}>
                  {RELATION_TYPES_STRRES[key]}
                </option>
              ))}
            </select>
            <EntityName entityKey={invert ? entity1Key : entity2Key} />
            <button type="button" onClick={this.toggleInvert}>
              Invert direction
            </button>
          </div>
          <Label>
            Succint element description:
            <TextArea
              value={this.state.text}
              onChange={this.onDescriptionChange}
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
            <input
              type="checkbox"
              checked={this.state.exactAmount}
              onChange={this.onExactAmountChange}
            />
            Exact amount known
          </Label>
          {initialEdge.sourceText && `(${initialEdge.sourceText})`}
          {isNew &&
            (this.state.sourceKey ? (
              <SourceDetails
                sourceKey={this.state.sourceKey}
                onCancelClick={this.onSourceDeselected}
              />
            ) : (
              <SourceEditor
                sourceKey={this.state.sourceKey}
                onSourceSelected={this.onSourceSelected}
                editorId={this.sourceEditorId}
              />
            ))}
          {isNew && (
            <Label>
              Comment
              <textarea
                onChange={this.onCommentChange}
                value={this.state.comment}
              />
            </Label>
          )}
          <button type="submit">Save</button>
          {isNew && (
            <button onClick={this.onRefutingSubmit}>
              Save with refuting source
            </button>
          )}
          {!isNew && (
            <ButtonWithConfirmation onAction={this.props.onDelete}>
              Delete
            </ButtonWithConfirmation>
          )}
        </form>
      </Content>
    );
  }
}

export default EdgeForm;
