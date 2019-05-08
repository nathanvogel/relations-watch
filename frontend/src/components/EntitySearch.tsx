import styled from "styled-components";
import * as React from "react";
// import AsyncSelect from "react-select/lib/Async";
import AsyncCreatable from "react-select/lib/AsyncCreatable";
import update from "immutability-helper";

import api from "../utils/api";
import EntityEditor from "./EntityEditor";
import { Entity, ReactSelectOption, EntityType } from "../utils/types";

interface Suggestion {
  _key: string;
  name: string;
  type: EntityType;
}
interface ReactSelectInputValue {
  inputValue: string;
}

const promiseAutocomplete = async (inputValue: string) => {
  // No need to query the server too fast
  if (!inputValue || inputValue.length <= 1) return;
  // Query our beautiful API
  const response = await api.get("/entities/autocomplete/" + inputValue);
  if (response.status === 200) {
    // Convert the API data to react-select format.
    const suggestions: Array<ReactSelectOption> = [];
    const data = response.data as Array<Suggestion>;
    for (var i = 0; i < data.length; i += 1) {
      suggestions.push({
        value: data[i]._key,
        label: data[i].name,
        type: data[i].type
      });
    }
    return suggestions;
  } else {
    console.error("Error requesting suggestions: " + response.status);
    console.error(response);
    return [];
  }
};

const StyledSelect = styled(AsyncCreatable)`
  min-width: 150px;
  display: inline-block;

  .rs__indicators {
    display: none;
  }
  .rs__control {
    min-height: 22px;
    border-radius: 0px;
  }
  .rs__control--is-focused {
    border-radius: 0px;
  }
`;

export interface Props {
  selection?: any;
  onChange?: (value: ReactSelectOption) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
  isMulti?: boolean;
}

// object is the state type
class EntitySearch extends React.Component<Props, object> {
  static defaultProps = {
    autoFocus: false,
    isMulti: false
  };

  readonly state = {
    creatingEntity: false,
    newEntityName: ""
  };

  onChange = (object: any) => {
    if (this.props.onChange) this.props.onChange(object);
  };

  onInputChange = (text: any, a: any) => {
    const action: string = a.action;
    if (action === "menu-close" || action === "input-blur") return;
    else if (this.props.onInputChange) {
      this.props.onInputChange(text);
    }
  };

  isValidNewOption = (inputValue: string) => {
    return Boolean(inputValue && inputValue.length >= 2);
  };

  onCreateOption = (value: string) => {
    this.setState({
      newEntityName: value,
      creatingEntity: true
    });
  };

  onDoneCreating = (newEntity?: Entity) => {
    this.setState({
      creatingEntity: false
    });
    // TODO : change value
    if (newEntity && newEntity._key) {
      const newValue = { value: newEntity._key, label: newEntity.name };
      this.onChange(
        this.props.isMulti
          ? update(this.props.selection || [], { $push: [newValue] })
          : newValue
      );
    }
  };

  render() {
    const { creatingEntity, newEntityName } = this.state;

    if (creatingEntity) {
      return (
        <EntityEditor
          onDone={this.onDoneCreating}
          initialName={newEntityName}
        />
      );
    }

    return (
      <StyledSelect
        className={this.props.className}
        cacheOptions
        defaultOptions
        classNamePrefix="rs"
        value={this.props.selection}
        onChange={this.onChange}
        onInputChange={this.onInputChange}
        inputValue={
          this.props.onInputChange ? this.props.inputValue : undefined
        }
        autoFocus={this.props.autoFocus}
        onCreateOption={this.onCreateOption}
        isMulti={this.props.isMulti}
        noOptionsMessage={(d: ReactSelectInputValue) => {
          return d.inputValue && d.inputValue.length > 1
            ? "Nothing found"
            : null;
        }}
        placeholder="Search..."
        loadOptions={promiseAutocomplete}
        isValidNewOption={this.isValidNewOption}
        allowCreateWhileLoading={false}
      />
    );
  }
}

export default EntitySearch;
