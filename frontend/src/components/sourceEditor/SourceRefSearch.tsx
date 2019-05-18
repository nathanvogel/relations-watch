import React from "react";

import api from "../../utils/api";
import StyledAsyncCreatableSelect from "../select/StyledAsyncCreatableSelect";
import { SourceSelectOption, SourceSuggestion } from "../../utils/types";

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
class SourceRefSearch extends React.Component<Props, object> {
  onChange = (object: any) => {
    if (this.props.onChange) this.props.onChange(object);
  };

  onInputChange = (text: any, a: any) => {
    const action: string = a.action;
    if (
      action === "menu-close" ||
      action === "input-blur" ||
      action === "set-value"
    )
      return;
    console.log("Text = ", text);
    console.log(action);
    if (this.props.onInputChange) {
      this.props.onInputChange(text);
    }
  };

  render() {
    return (
      <StyledAsyncCreatableSelect
        className={this.props.className}
        cacheOptions
        defaultOptions
        onChange={this.onChange}
        onInputChange={this.onInputChange}
        inputValue={
          this.props.onInputChange ? this.props.inputValue : undefined
        }
        allowCreateWhileLoading
        onCreateOption={this.props.onCreateSource}
        noOptionsMessage={(d: ReactSelectInputValue) => {
          return d.inputValue && d.inputValue.length > 1
            ? "Nothing found"
            : null;
        }}
        placeholder="..."
        loadOptions={promiseAutocomplete}
      />
    );
  }
}

export default SourceRefSearch;
