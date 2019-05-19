import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import StyledAsyncCreatableSelect from "../select/StyledAsyncCreatableSelect";
import { SourceSelectOption, SourceSuggestion } from "../../utils/types";
import R from "../../strings/R";

interface ReactSelectInputValue {
  inputValue: string;
}

const promiseAutocomplete = async (inputValue: string) => {
  // No need to query the server too fast
  if (!inputValue || inputValue.length <= 1) return;
  // Query our beautiful API
  const response = await api.get("/sources/autocomplete", {
    params: { search: inputValue }
  });
  if (response.status === 200) {
    // Convert the API data to react-select format.
    const data = response.data as Array<SourceSuggestion>;
    const suggestions: Array<SourceSelectOption> = [];
    for (var i = 0; i < data.length; i += 1) {
      suggestions.push({
        value: data[i]._key,
        label: data[i].pTitle || data[i].ref,
        ref: data[i].ref,
        pTitle: data[i].pTitle,
        fullUrl: data[i].fullUrl
      });
    }
    return suggestions;
  } else {
    console.error("Error requesting suggestions: " + response.status);
    console.error(response);
    return [];
  }
};

type Props = {
  onChange?: (value: SourceSelectOption) => void;
  onInputChange?: (value: string) => void;
  inputValue?: string;
  onCreateSource: (value: string) => void;
  className?: string;
};

// object is the state type
const SourceRefSearch: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();

  const onChange = (object: any) => {
    if (props.onChange) props.onChange(object);
  };

  const onInputChange = (text: any, a: any) => {
    const action: string = a.action;
    if (
      action === "menu-close" ||
      action === "input-blur" ||
      action === "set-value"
    )
      return;
    if (props.onInputChange) {
      props.onInputChange(text);
    }
  };

  return (
    <StyledAsyncCreatableSelect
      className={props.className}
      cacheOptions
      defaultOptions
      onChange={onChange}
      onInputChange={onInputChange}
      inputValue={props.onInputChange ? props.inputValue : undefined}
      allowCreateWhileLoading
      onCreateOption={props.onCreateSource}
      noOptionsMessage={(d: ReactSelectInputValue) => {
        return d.inputValue && d.inputValue.length > 1
          ? t(R.label_no_element_found)
          : null;
      }}
      placeholder={t(R.placeholder_add_reference)}
      loadOptions={promiseAutocomplete}
      formatCreateLabel={(inputValue: string) =>
        t(R.label_select_add, { userInput: inputValue })
      }
    />
  );
};

export default SourceRefSearch;
