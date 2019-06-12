import styled from "styled-components";
import * as React from "react";
// import AsyncSelect from "react-select/lib/Async";
import update from "immutability-helper";
import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import wd from "wikidata-sdk";

import api from "../utils/api";
import EntityEditor from "./EntityEditor";
import {
  Entity,
  EntitySelectOption,
  EntityType,
  DatasetId,
} from "../utils/types";
import StyledAsyncCreatableSelect from "./select/StyledAsyncCreatableSelect";
import R from "../strings/R";
import Importer from "./Importer";
import { checkAxiosResponse, checkWDData } from "../utils/api-wd";
import Modal from "./layout/Modal";
import i18n from "../i18n/i18n";
import { components } from "react-select/lib/components";
import { OptionProps } from "react-select/lib/components/Option";
import SearchResultPreview from "./entity/SearchResultPreview";

interface Suggestion {
  _key: string;
  name: string;
  type: EntityType;
  text?: string;
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
    const suggestions: Array<EntitySelectOption> = [];
    const data = response.data as Array<Suggestion>;
    for (var i = 0; i < data.length; i += 1) {
      suggestions.push({
        value: data[i]._key,
        label: data[i].name,
        type: data[i].type,
        text: data[i].text,
      });
    }
    return suggestions;
  } else {
    console.error("Error requesting suggestions: " + response.status);
    console.error(response);
    return [];
  }
};

const promiseWikidataAutocomplete = async (inputValue: string) => {
  // No need to query the server too fast
  if (!inputValue || inputValue.length <= 1) return []; //[{ value: "1", label: "oawjeoifja awoiefj ", type: 1 }];
  // Query our beautiful API
  // https://www.wikidata.org/w/api.php?action=wbsearchentities&search=ok&format=json&language=en&uselang=en&type=item
  try {
    const url = wd.searchEntities(
      inputValue,
      i18n.language.indexOf("fr") === 0 ? "fr" : "en",
      12,
      "json",
      i18n.language.indexOf("fr") === 0 ? "fr" : "en"
    );
    const data = (await checkWDData(
      await checkAxiosResponse(await axios.get(url))
    )).search;
    if (!data) return [];
    // Convert the API data to react-select format.
    const suggestions: Array<EntitySelectOption> = [];
    for (var i = 0; i < data.length; i += 1) {
      suggestions.push({
        value: data[i].id,
        label: data[i].label,
        text: data[i].description,
        dataset: DatasetId.Wikidata,
      });
    }
    return suggestions;
  } catch (err) {
    return [
      {
        value: null,
        label: "An error occured",
        text: err && err.message ? err.message : "unknown error",
        dataset: DatasetId.Wikidata,
      },
    ];
  }
};

const Option = (props: OptionProps<Suggestion>) => {
  if (props.data.__isNew__) return <components.Option {...props} />;
  return (
    <components.Option {...props}>
      <SearchResultPreview entity={props.data} />
    </components.Option>
  );
};

const MySelect = styled(StyledAsyncCreatableSelect)`
  min-width: 150px;
  display: inline-block;
`;

const WikidataCreateSubtitle = styled.div`
  font-size: ${props => props.theme.fontSizeS};
`;

export interface Props {
  selection?: any;
  onChange?: (value: EntitySelectOption) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
  isMulti?: boolean;
  placeholder?: string;
  forceMenuOnTop?: boolean;
}

const defaultProps: Props = {
  autoFocus: false,
  isMulti: false,
};

const EntitySearch: FunctionComponent<Props> = (
  props: Props = defaultProps
) => {
  const [mode, setMode] = useState("searchDb");
  const [newEntityName, setNewEntityName] = useState("");
  const [selectedWdEntity, setSelectedWdEntity] = useState(undefined);
  const [ownInputValue, setOwnInputValue] = useState("");
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  // We use a hack to force react-select to reload the options when switching
  // databases, by re-creating the component, with mode, but then we also
  // want to keep the focus in some cases.
  const [forceAutoFocus, setForceAutoFocus] = useState(false);
  const { t } = useTranslation();

  const onChange = (object: any) => {
    if (mode === "searchWd") {
      setSelectedWdEntity(
        props.isMulti ? object[object.length - 1].value : object.value
      );
      setMode("importWd");
      return;
    }

    // Default props action
    if (props.onChange) props.onChange(object);
    // We need to recreate that event, since we filter it because the text
    // shouldn't be cleared when going from searchDb -> searchWd
    onInputChange("", {});
  };

  const onInputChange = (text: any, a: any) => {
    const action: string = a.action;
    // Possible values: "set-value", "input-change", "input-blur", "menu-close"
    // TODO: blur suggestion to add X
    setMenuIsOpen(
      !(
        action === "menu-close" ||
        action === "set-value" ||
        action === "input-blur"
      )
    );
    if (
      action !== "menu-close" &&
      action !== "input-blur" &&
      action !== "set-value"
    ) {
      if (props.onInputChange) props.onInputChange(text);
      else setOwnInputValue(text);
    }
    // A way to go back to the regular database search
    if (mode === "searchWd" && action === "input-change" && text === "") {
      setForceAutoFocus(true);
      setMode("searchDb");
    }
  };

  const onFocus = () => {
    setMenuIsOpen(true);
    // forceAutoFocus should only work once. It is only to keep the focus
    // when re-creating the react-select element.
    setForceAutoFocus(false);
  };

  const isValidNewOption = (inputValue: string) => {
    return Boolean(inputValue && inputValue.length >= 2);
  };

  const onDoneCreating = (newEntity?: Entity) => {
    setMode("searchDb");
    onInputChange("", {});

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

  if (mode === "create") {
    return (
      <Modal onClose={() => setMode("searchDb")}>
        <EntityEditor onDone={onDoneCreating} initialName={newEntityName} />
      </Modal>
    );
  } else if (mode === "importWd") {
    return (
      <Modal onClose={() => setMode("searchDb")}>
        <Importer
          datasetId={DatasetId.Wikidata}
          entityDatasetId={selectedWdEntity}
          onDone={onDoneCreating}
          autoCreate
        />
      </Modal>
    );
  }

  return (
    // Setting a key to re-create the component seems to be the only way to
    // force a reload of the options.
    <MySelect
      key={mode}
      className={props.className}
      cacheOptions={true}
      defaultOptions
      classNamePrefix="rs"
      value={props.selection}
      onChange={onChange}
      onInputChange={onInputChange}
      inputValue={props.onInputChange ? props.inputValue : ownInputValue}
      autoFocus={forceAutoFocus || props.autoFocus}
      onCreateOption={(value: string) => {
        switch (mode) {
          case "searchDb":
            setForceAutoFocus(true);
            setMode("searchWd");
            break;
          case "searchWd":
            setNewEntityName(value);
            setMode("create");
            break;
        }
      }}
      isMulti={props.isMulti}
      noOptionsMessage={(d: ReactSelectInputValue) => {
        return d.inputValue && d.inputValue.length > 1
          ? t(R.label_no_element_found)
          : null;
      }}
      placeholder={
        props.placeholder == null ? t(R.placeholder_search) : props.placeholder
      }
      loadOptions={
        mode === "searchWd" ? promiseWikidataAutocomplete : promiseAutocomplete
      }
      isValidNewOption={isValidNewOption}
      allowCreateWhileLoading={false}
      formatCreateLabel={(inputValue: string) =>
        mode === "searchDb" ? (
          <React.Fragment>
            <div>{t(R.label_select_create_wikidata)}</div>
            <WikidataCreateSubtitle>
              {t(R.label_select_create_wikidata_sub, { userInput: inputValue })}
            </WikidataCreateSubtitle>
          </React.Fragment>
        ) : (
          t(R.label_select_create, { userInput: inputValue })
        )
      }
      menuIsOpen={true}
      onFocus={onFocus}
      forceMenuOnTop={props.forceMenuOnTop}
      components={{ Option }}
    />
  );
};

export default EntitySearch;
