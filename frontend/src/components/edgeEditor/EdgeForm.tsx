import React from "react";
import styled from "styled-components";

import EntityName from "./EntityName";
import { TypeOptions } from "../../strings/strings";
import { Edge, SourceLink, SourceLinkType, Source } from "../../utils/types";
import ButtonWithConfirmation from "../buttons/ButtonWithConfirmation";
import SourceSelector from "../SourceSelector";
import SourceDetails from "../SourceDetails";
import TextArea from "../inputs/TextArea";
import Label from "../inputs/Label";
import Input from "../inputs/Input";
import StyledSelect from "../select/StyledSelect";
import { ReactComponent as SwapIcon } from "../../assets/ic_swap.svg";
import IconButton from "../buttons/IconButton";
import { TP } from "../../utils/theme";
import ButtonBar from "../buttons/ButtonBar";

const Content = styled.div`
  display: block;
`;

const TypeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(150px, 2fr) 1fr;
  align-items: center;
  grid-column-gap: ${(props: TP) => props.theme.marginLR};

  & > *:nth-child(1) {
    justify-self: end;
  }
  & > *:nth-child(2) {
    justify-self: center;
    width: 100%;
    display: flex;

    div:nth-child(1) {
      padding-right: ${(props: TP) => props.theme.inputLRSpacing};
      flex-grow: 100;
    }
  }
  & > *:nth-child(3) {
    justify-self: start;
    text-align: right;
  }
`;

const AmountInput = styled(Input)`
  margin-right: ${(props: TP) => props.theme.inputLRSpacing};
  margin-top: ${(props: TP) => props.theme.inputTBSpacing};
`;

const SaveButtonBar = styled(ButtonBar)`
  margin: ${(props: TP) => props.theme.marginTB} 0px;
`;

type Props = {
  entity1Key: string;
  entity2Key: string;
  onFormSubmit: (edge: Edge, comment?: SourceLink) => void;
  onDelete: () => void;
  disabled: boolean;
  initialEdge: Edge;
  sourceEditorId: string;
  loadSources: (sourceKeys: string[], doLoadEntities: boolean) => void;
  sourceFormData: Source;
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
      sourceText: "",
      sources: []
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

  get hasSource() {
    return this.state.sourceKey || this.props.sourceFormData;
  }

  get isNew() {
    return !Boolean(this.props.initialEdge._key);
  }

  onDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ text: event.target.value });
  };

  onTypeChange = (option: any) => {
    this.setState({ type: option ? option.value : null });
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

  onSourceSelected = (sourceKey?: string) => {
    this.setState({ sourceKey });
    // One day, loadSources will handle not re-requesting sources.
    if (sourceKey) this.props.loadSources([sourceKey], true);
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
    const edge: Edge = Object.assign({}, this.props.initialEdge, {
      _from: invert ? entity2Key : entity1Key,
      _to: invert ? entity1Key : entity2Key,
      text: this.state.text,
      type: this.state.type,
      amount: this.state.amount,
      exactAmount: this.state.exactAmount,
      sourceText: this.props.initialEdge.sourceText
    });

    // If we are updating an existing edge without adding a source,
    // no need to compute the sourceLink
    if (!this.isNew && !this.hasSource) {
      this.props.onFormSubmit(edge);
      return;
    }

    // sourceKey is undefined if it's a new source. If so, the onFormSubmit
    // function should look for the sourceForm with the given sourceFormId
    // in the Redux store.
    const { sourceKey, comment } = this.state;
    const sourceLink: SourceLink = {
      comments: comment ? [{ t: comment }] : [],
      type: confirms ? SourceLinkType.Confirms : SourceLinkType.Refutes,
      sourceKey: sourceKey // Optional
    };
    this.props.onFormSubmit(edge, sourceLink);
  };

  render() {
    const { entity1Key, entity2Key, initialEdge } = this.props;
    const invert = this.state.invertDirection;

    var selectedType = null;
    for (let type of TypeOptions) {
      if (type.value === this.state.type) selectedType = type;
    }

    return (
      <Content>
        <form onSubmit={this.onSubmit}>
          <TypeContainer>
            <EntityName entityKey={invert ? entity2Key : entity1Key} />
            <div>
              <StyledSelect
                autoFocus
                options={TypeOptions}
                value={selectedType}
                onChange={this.onTypeChange}
                placeholder="..."
              />
              <IconButton type="button" onClick={this.toggleInvert}>
                <SwapIcon />
              </IconButton>
            </div>
            <EntityName entityKey={invert ? entity1Key : entity2Key} />
          </TypeContainer>
          <Label htmlFor="description">Short neutral description</Label>
          <TextArea
            name="description"
            value={this.state.text}
            onChange={this.onDescriptionChange}
          />
          <AmountInput
            name="amountInvolved"
            type="number"
            value={this.state.amount}
            onChange={this.onAmountChange}
          />
          <Label as="span" htmlFor="amountInvolved">
            US $ involved
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
          <SourceSelector
            sourceKey={this.state.sourceKey}
            onSourceSelected={this.onSourceSelected}
            editorId={this.props.sourceEditorId}
          />
          {this.hasSource && (
            <React.Fragment>
              <Label htmlFor="sourceComment">Comment</Label>
              <TextArea
                name="sourceComment"
                onChange={this.onCommentChange}
                value={this.state.comment}
              />
            </React.Fragment>
          )}
          <SaveButtonBar>
            <IconButton disabled={this.isNew && !this.hasSource} type="submit">
              Save
            </IconButton>
            {this.hasSource && (
              <IconButton type="button" onClick={this.onRefutingSubmit}>
                Save with refuting reference
              </IconButton>
            )}
            {!this.isNew && (
              <ButtonWithConfirmation onAction={this.props.onDelete}>
                Delete this relation element
              </ButtonWithConfirmation>
            )}
          </SaveButtonBar>
        </form>
        {initialEdge.sources.map((sourceLink, index) => (
          <SourceDetails
            key={sourceLink.sourceKey}
            sourceKey={sourceLink.sourceKey as string}
            sourceLink={sourceLink}
            editable
          />
        ))}
      </Content>
    );
  }
}

export default EdgeForm;
