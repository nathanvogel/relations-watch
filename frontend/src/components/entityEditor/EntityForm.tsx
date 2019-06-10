import React from "react";
import styled from "styled-components";
import cuid from "cuid";

import {
  Entity,
  EntityType,
  EntityTypeOption,
  EntityTypeValues,
} from "../../utils/types";
import IconButton from "../buttons/IconButton";
import ButtonBar from "../buttons/ButtonBar";
import StyledSelect from "../select/StyledSelect";
import Label from "../inputs/Label";
import EditorContainer from "../layout/EditorContainer";
import Input from "../inputs/Input";
import { EntityTypeMapping } from "../../strings/strings";
import i18n from "../../i18n/i18n";

const RestyledSelect = styled(StyledSelect)`
  width: 600px;
  max-width: 100%;
`;
const RestyledInput = styled(Input)`
  width: 600px;
  max-width: 100%;
`;

const EntityTypeOptions: EntityTypeOption[] = EntityTypeValues.map(value => ({
  value: value,
  label: i18n.t(EntityTypeMapping[value]),
}));

type Props = {
  onFormSubmit: (entity: Entity) => void;
  onFormCancel?: () => void;
  disabled: boolean;
  initialEntity: Entity | Entity;
};

type State = {
  name: string;
  text: string | undefined;
  type: EntityType | undefined;
  linkWikipedia?: string;
  linkCrunchbase?: string;
  linkTwitter?: string;
  linkFacebook?: string;
  linkYoutube?: string;
  linkWebsite?: string;
  formId: string;
};

class EntityForm extends React.Component<Props> {
  static defaultProps = {
    initialEntity: {
      name: "",
      text: "",
      type: EntityType.Human,
      linkWikipedia: "",
      linkCrunchbase: "",
      linkTwitter: "",
      linkFacebook: "",
      linkYoutube: "",
      linkWebsite: "",
    },
  };

  readonly state: State = {
    name: this.props.initialEntity.name,
    type: this.props.initialEntity.type,
    text: this.props.initialEntity.text || "",
    linkWikipedia: this.props.initialEntity.linkWikipedia,
    linkCrunchbase: this.props.initialEntity.linkCrunchbase,
    linkTwitter: this.props.initialEntity.linkTwitter,
    linkFacebook: this.props.initialEntity.linkFacebook,
    linkYoutube: this.props.initialEntity.linkYoutube,
    linkWebsite: this.props.initialEntity.linkWebsite,
    formId: "entity-" + cuid.slug(),
  };

  componentDidMount() {
    this.setState({ formId: "entity-" + cuid.slug() });
  }

  onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ text: event.target.value });
  };

  onTypeChange = (option: EntityTypeOption) => {
    this.setState({ type: option ? option.value : undefined });
  };

  onSubmit = () => {
    if (!this.state.name || this.state.name.length < 3) return;
    if (!this.state.type) return;

    const entity: Entity = {
      _key: this.props.initialEntity._key,
      name: this.state.name,
      text: this.state.text,
      type: this.state.type,
    };
    this.props.onFormSubmit(entity);
  };

  render() {
    var selectedEntityType: EntityTypeOption | null = null;
    for (let option of EntityTypeOptions) {
      if (option.value === this.state.type) {
        selectedEntityType = option;
        break;
      }
    }

    return (
      <EditorContainer>
        <Label htmlFor="entityName">Name</Label>
        <RestyledInput
          autoFocus
          type="text"
          name="entityName"
          maxLength={150}
          value={this.state.name}
          onChange={this.onNameChange}
          form={this.state.formId}
        />
        <Label htmlFor="entityText">Description</Label>
        <RestyledInput
          autoFocus
          type="text"
          name="entityText"
          maxLength={200}
          value={this.state.text}
          onChange={this.onTextChange}
          form={this.state.formId}
        />
        <Label htmlFor="entityType">Type</Label>
        <RestyledSelect
          name="entityType"
          options={EntityTypeOptions}
          value={selectedEntityType}
          onChange={this.onTypeChange}
          placeholder="..."
        />
        <ButtonBar>
          <IconButton
            withText
            disabled={this.props.disabled}
            onClick={this.onSubmit}
          >
            Save
          </IconButton>
          {this.props.onFormCancel && (
            <IconButton withText onClick={this.props.onFormCancel}>
              Cancel
            </IconButton>
          )}
        </ButtonBar>
      </EditorContainer>
    );
  }
}

export default EntityForm;
