import React from "react";
import styled from "styled-components";

import EntityName from "./EntityName";
import {
  Edge,
  SourceLink,
  SourceLinkType,
  Source,
  RelationType,
  RelationTypeOption,
  EntityPreview,
  Entity,
  RelationTypeRequirements,
  FamilialLink,
  FamilialLinkOption
} from "../../utils/types";
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
import {
  POSSIBLE_LINKS,
  RelationTypeOptions,
  RELATION_REQUIREMENTS,
  FamilialLinkOptions
} from "../../utils/consts";
import VerticalInputBar from "../buttons/VerticalInputBar";

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

    > div:nth-child(1) {
      padding-right: ${(props: TP) => props.theme.inputLRSpacing};
      flex-grow: 100;

      > * {
        display: block;
        width: 100%;
      }
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
  entity1: Entity | EntityPreview;
  entity2: Entity | EntityPreview;
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
  type: RelationType | undefined;
  amount?: number;
  exactAmount?: boolean;
  familialLink: FamilialLink | undefined;
  ownedPercent: number | undefined;
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
      familialLink: undefined,
      ownedPercent: 100,
      sourceText: "",
      sources: []
    }
  };

  readonly state: State = {
    text: this.props.initialEdge.text,
    type: this.props.initialEdge.type,
    amount: this.props.initialEdge.amount,
    exactAmount: this.props.initialEdge.exactAmount,
    familialLink: this.props.initialEdge.fType,
    ownedPercent: this.props.initialEdge.owned,
    comment: "",
    sourceKey: undefined,
    invertDirection: this.props.entity1Key === this.props.initialEdge._to
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

  onFamilialLinkChange = (option: any) => {
    this.setState({ familialLink: option ? option.value : null });
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
    const requirements = this.getRequirements();
    if (requirements.descriptionRequired && !this.state.text) return;
    if (requirements.familialLinkType && !this.state.familialLink) return;

    const { entity1Key, entity2Key } = this.props;
    const invert = this.state.invertDirection;
    const edge: Edge = Object.assign({}, this.props.initialEdge, {
      _from: invert ? entity2Key : entity1Key,
      _to: invert ? entity1Key : entity2Key,
      text: this.state.text,
      type: this.state.type,
      amount: this.state.amount,
      exactAmount: this.state.exactAmount,
      fType: this.state.familialLink,
      owned: this.state.ownedPercent,
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

  componentDidUpdate() {
    // If we're in a possible configuration of entity1.type <-> entity2.type
    // but that is only possible in the opposite direction, swap entities.
    if (this.state.type) {
      const allowed = POSSIBLE_LINKS[this.state.type];
      const invert = this.state.invertDirection;
      const { entity1, entity2 } = this.props;
      const typeFrom = invert ? entity2.type : entity1.type;
      const typeTo = invert ? entity1.type : entity2.type;
      const isCurrentAllowed =
        allowed[0].indexOf(typeFrom) >= 0 && allowed[1].indexOf(typeTo) >= 0;
      const isInvertAllowed =
        allowed[0].indexOf(typeTo) >= 0 && allowed[1].indexOf(typeFrom) >= 0;

      if (!isCurrentAllowed && isInvertAllowed) {
        this.setState({ invertDirection: !invert });
      }
    }
  }

  getRequirements = () =>
    this.state.type ? RELATION_REQUIREMENTS[this.state.type] : {};

  render() {
    const { entity1Key, entity2Key, initialEdge } = this.props;
    const invert = this.state.invertDirection;

    // Find the selected value
    var selectedType: RelationTypeOption | null = null;
    for (let option of RelationTypeOptions) {
      if (option.value === this.state.type) selectedType = option;
    }
    var selectedFamilialLink: FamilialLinkOption | null = null;
    for (let option of FamilialLinkOptions) {
      if (option.value === this.state.familialLink)
        selectedFamilialLink = option;
    }

    // List all possible types compatible with the entity types
    // (ignoring the direction, which is automatically corrected
    // in componentDidUpdate)
    const { entity1, entity2 } = this.props;
    const possibleTypes: RelationTypeOption[] = RelationTypeOptions.filter(
      option => {
        const allowed = POSSIBLE_LINKS[option.value];
        return (
          (allowed[0].indexOf(entity1.type) >= 0 &&
            allowed[1].indexOf(entity2.type) >= 0) ||
          (allowed[1].indexOf(entity1.type) >= 0 &&
            allowed[0].indexOf(entity2.type) >= 0)
        );
      }
    );

    const requirements = this.getRequirements();

    return (
      <Content>
        <form onSubmit={this.onSubmit}>
          <TypeContainer>
            <EntityName entityKey={invert ? entity2Key : entity1Key} />
            <div>
              <VerticalInputBar>
                <StyledSelect
                  autoFocus
                  options={possibleTypes}
                  value={selectedType}
                  onChange={this.onTypeChange}
                  placeholder="..."
                />
                {requirements.familialLinkType && (
                  <StyledSelect
                    options={FamilialLinkOptions}
                    value={selectedFamilialLink}
                    onChange={this.onFamilialLinkChange}
                    placeholder="..."
                  />
                )}
              </VerticalInputBar>
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
