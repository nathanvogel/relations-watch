import styled from "styled-components";
import * as React from "react";
// import AsyncSelect from "react-select/lib/Async";
import update from "immutability-helper";

import api from "../utils/api";
import EntityEditor from "./EntityEditor";
import { Entity, ReactSelectOption, EntityType } from "../utils/types";
import StyledAsyncCreatableSelect from "./select/StyledAsyncCreatableSelect";
import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import R from "../strings/R";

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
  if (!inputValue || inputValue.length <= 1) return []; //[{ value: "1", label: "oawjeoifja awoiefj ", type: 1 }];
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

const MySelect = styled(StyledAsyncCreatableSelect)`
  min-width: 150px;
  display: inline-block;
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

const defaultProps: Props = {
  autoFocus: false,
  isMulti: false
};

const EntitySearch: FunctionComponent<Props> = (
  props: Props = defaultProps
) => {
  const [creatingEntity, setCreatingEntity] = useState(false);
  const [newEntityName, setNewEntityName] = useState("");
  const { t } = useTranslation();

  const onChange = (object: any) => {
    if (props.onChange) props.onChange(object);
  };

  const onInputChange = (text: any, a: any) => {
    const action: string = a.action;
    if (action === "menu-close" || action === "input-blur") return;
    else if (props.onInputChange) {
      props.onInputChange(text);
    }
  };

  const isValidNewOption = (inputValue: string) => {
    return Boolean(inputValue && inputValue.length >= 2);
  };

  const onCreateOption = (value: string) => {
    setNewEntityName(value);
    setCreatingEntity(true);
  };

  const onDoneCreating = (newEntity?: Entity) => {
    setCreatingEntity(false);

    // TODO : change value
    if (newEntity && newEntity._key) {
      const newValue = { value: newEntity._key, label: newEntity.name };
      onChange(
        props.isMulti
          ? update(props.selection || [], { $push: [newValue] })
          : newValue
      );
    }
  };

  if (creatingEntity) {
    return <EntityEditor onDone={onDoneCreating} initialName={newEntityName} />;
  }

  return (
    <MySelect
      className={props.className}
      cacheOptions
      defaultOptions
      classNamePrefix="rs"
      value={props.selection}
      onChange={onChange}
      onInputChange={onInputChange}
      inputValue={props.onInputChange ? props.inputValue : undefined}
      autoFocus={props.autoFocus}
      onCreateOption={onCreateOption}
      isMulti={props.isMulti}
      noOptionsMessage={(d: ReactSelectInputValue) => {
        return d.inputValue && d.inputValue.length > 1
          ? t(R.label_no_element_found)
          : null;
      }}
      placeholder={t(R.placeholder_search)}
      loadOptions={promiseAutocomplete}
      isValidNewOption={isValidNewOption}
      allowCreateWhileLoading={false}
      menuIsOpen={true}
      formatCreateLabel={(inputValue: string) =>
        t(R.label_select_add, { userInput: inputValue })
      }
    />
  );
};

export default EntitySearch;
