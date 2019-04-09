import styled from "styled-components";
import * as React from "react";
import AsyncSelect from "react-select/lib/Async";
import api from "../utils/api";

export interface Suggestion {
  _key: string;
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
  const response = await api.get("/entities/autocomplete/" + inputValue);
  if (response.status === 200) {
    // Convert the API data to react-select format.
    const suggestions: Array<ReactSelectOption> = [];
    const data = response.data as Array<Suggestion>;
    for (var i = 0; i < data.length; i += 1) {
      suggestions.push({
        value: data[i]._key,
        label: data[i].name
      });
    }
    return suggestions;
  } else {
    console.error("Error requesting suggestions: " + response.status);
    console.error(response);
    return [];
  }
};

const StyledSelect = styled(AsyncSelect)`
  min-width: 240px;

  .rs__indicators {
    display: none;
  }
`;

export interface Props {
  onChange?: (value: string) => void;
  className?: string;
}

// object is the state type
class SearchEntity extends React.Component<Props, object> {
  onChange = (object: any) => {
    if (this.props.onChange) this.props.onChange(object.value);
  };

  render() {
    return (
      <StyledSelect
        className={this.props.className}
        cacheOptions
        defaultOptions
        classNamePrefix="rs"
        onChange={this.onChange}
        noOptionsMessage={(d: ReactSelectInputValue) => {
          return d.inputValue && d.inputValue.length > 1
            ? "No corresponding person"
            : null;
        }}
        placeholder="Search..."
        loadOptions={promiseAutocomplete}
      />
    );
  }
}

export default SearchEntity;
