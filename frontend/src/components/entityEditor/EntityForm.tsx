import React from "react";
import styled from "styled-components";

import CONSTS from "../../utils/consts";
import { ENTITY_TYPES } from "../../strings/strings";
import { Entity, EntityType, EntityTypeValues } from "../../utils/types";
import Button from "../buttons/Button";
import cuid from "cuid";

const Content = styled.div`
  display: block;
  border: grey 1px dotted;
  padding: 12px;
`;

const Label = styled.label`
  display: block;
`;

type Props = {
  onFormSubmit: (entity: Entity) => void;
  onFormCancel?: () => void;
  disabled: boolean;
  initialEntity: Entity | Entity;
};

type State = {
  name: string;
  type: number;
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
      type: EntityType.PhysicalPerson,
      linkWikipedia: "",
      linkCrunchbase: "",
      linkTwitter: "",
      linkFacebook: "",
      linkYoutube: "",
      linkWebsite: ""
    }
  };

  readonly state: State = {
    name: this.props.initialEntity.name,
    type: this.props.initialEntity.type,
    linkWikipedia: this.props.initialEntity.linkWikipedia,
    linkCrunchbase: this.props.initialEntity.linkCrunchbase,
    linkTwitter: this.props.initialEntity.linkTwitter,
    linkFacebook: this.props.initialEntity.linkFacebook,
    linkYoutube: this.props.initialEntity.linkYoutube,
    linkWebsite: this.props.initialEntity.linkWebsite,
    formId: "entity-" + cuid.slug()
  };

  componentDidMount() {
    this.setState({ formId: "entity-" + cuid.slug() });
  }

  onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  onTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ type: +event.target.value });
  };

  onSubmit = () => {
    if (!this.state.name || this.state.name.length < 3) return;

    const entity: Entity = {
      _key: this.props.initialEntity._key,
      name: this.state.name,
      type: this.state.type
    };
    this.props.onFormSubmit(entity);
  };

  render() {
    return (
      <Content>
        <fieldset disabled={this.props.disabled}>
          <div>
            <Label>
              Name
              <input
                type="text"
                maxLength={200}
                value={this.state.name}
                onChange={this.onNameChange}
                form={this.state.formId}
              />
            </Label>
            <select
              value={this.state.type}
              onChange={this.onTypeChange}
              form={this.state.formId}
            >
              {EntityTypeValues.map((key: EntityType) => (
                <option key={key} value={key}>
                  {ENTITY_TYPES[key]}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={this.onSubmit}>Save</Button>
          {this.props.onFormCancel && (
            <Button onClick={this.props.onFormCancel}>Cancel</Button>
          )}
        </fieldset>
      </Content>
    );
  }
}

export default EntityForm;
