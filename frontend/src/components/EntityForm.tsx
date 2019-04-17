import React from "react";
import styled from "styled-components";

import CONSTS from "../utils/consts";
import { ENTITY_TYPES } from "../strings/strings";
import { Entity } from "../utils/types";

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
  disabled: boolean;
  initialEntity: Entity;
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
};

class EntityForm extends React.Component<Props> {
  static defaultProps = {
    initialEntity: {
      name: "",
      type: CONSTS.ENTITY_TYPES.PHYSICAL_PERSON,
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
    linkWebsite: this.props.initialEntity.linkWebsite
  };

  onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  onTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ type: +event.target.value });
  };

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
        <form onSubmit={this.onSubmit}>
          <fieldset disabled={this.props.disabled}>
            <div>
              <Label>
                Name
                <input
                  type="text"
                  maxLength={200}
                  value={this.state.name}
                  onChange={this.onNameChange}
                />
              </Label>
              <select value={this.state.type} onChange={this.onTypeChange}>
                {Object.keys(CONSTS.ENTITY_TYPES).map(key => (
                  <option key={key} value={CONSTS.ENTITY_TYPES[key]}>
                    {ENTITY_TYPES[key]}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit">Save</button>
          </fieldset>
        </form>
      </Content>
    );
  }
}

export default EntityForm;
