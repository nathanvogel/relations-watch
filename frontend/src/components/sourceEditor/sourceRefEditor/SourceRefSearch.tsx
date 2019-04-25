import React from "react";
import api from "../../../utils/api";
import StyledAsyncSelect from "../../StyledAsyncSelect";

export interface Suggestion {
  ref: string;
  name: string;
}
export interface ReactSelectOption {
  value: string;
  label: string;
}
export interface ReactSelectInputValue {
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
    const suggestions: Array<ReactSelectOption> = [];
    const data = response.data as Array<Suggestion>;
    for (var i = 0; i < data.length; i += 1) {
      suggestions.push({
        value: data[i].ref,
        label: data[i].ref
      });
    }
    return suggestions;
  } else {
    console.error("Error requesting suggestions: " + response.status);
    console.error(response);
    return [];
  }
};

export interface Props {
  onChange?: (value: string) => void;
  onInputChange?: (value: string) => void;
  inputValue?: string;
  onCreateRef: (value: string) => void;
}

// object is the state type
class SourceRefSearch extends React.Component<Props, object> {
  onChange = (object: any) => {
    console.log("onChange selection", object);
    if (this.props.onChange) this.props.onChange(object.value);
  };

  onInputChange = (text: any, a: any) => {
    const action: string = a.action;
    if (action === "menu-close" || action === "input-blur") return;
    else if (this.props.onInputChange) {
      this.props.onInputChange(text);
    }
  };

  render() {
    return (
      <StyledAsyncSelect
        cacheOptions
        defaultOptions
        classNamePrefix="rs"
        onChange={this.onChange}
        onInputChange={this.onInputChange}
        inputValue={
          this.props.onInputChange ? this.props.inputValue : undefined
        }
        autoFocus
        allowCreateWhileLoading
        onCreateOption={this.props.onCreateRef}
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
