import React from "react";
import styled from "styled-components";
import { Dispatch, bindActionCreators, AnyAction } from "redux";
import { connect } from "react-redux";
import { ValueType } from "react-select/lib/types";

import { Source, ReactSelectOption, SourceType } from "../utils/types";
import Button from "./buttons/Button";
import EntitySearch from "./EntitySearch";
import { RootStore } from "../Store";
import * as sourceFormActions from "../features/sourceFormActions";

type OwnProps = {
  editorId: string;
  initialSource: Source;
  onCancelClick: () => void;
  onSaveClick?: () => void;
};

const Label = styled.label`
  display: block;
`;

const Content = styled.div`
  display: block;
`;

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { editorId } = props;
  const formData = state.sourceForms[editorId];
  // Besides the [entityKey1, entityKey2, ...] selection format stored
  // in the database, we need the same array with {value, label} pairs.
  // So we generate one here from the store.
  const selectedAuthors: ValueType<ReactSelectOption> = [];
  if (formData) {
    const entities = state.entities.datapreview;
    for (let entityKey of formData.authors) {
      const name = entities[entityKey] ? entities[entityKey].name : entityKey;
      selectedAuthors.push({
        label: name,
        value: entityKey
      });
    }
  }
  return {
    formData,
    selectedAuthors,
    ...props
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      onDescriptionChange: sourceFormActions.souDescriptionChange,
      onAuthorsChange: sourceFormActions.souAuthorsChange,
      feedInitialFormData: sourceFormActions.souInitialData,
      clearFormData: sourceFormActions.souClearData
    },
    dispatch
  );

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

/**
 * Always set the React key attribute to the same as editorId, in order to
 * remount component.
 * @extends React
 */
class SourceForm extends React.Component<Props> {
  componentDidMount() {
    this.props.feedInitialFormData(
      this.props.editorId,
      this.props.initialSource
    );
  }

  componentWillUnmount() {
    this.props.clearFormData(this.props.editorId);
  }

  onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onDescriptionChange(this.props.editorId, event.target.value);
  };

  onAuthorsChange = (selection: ValueType<ReactSelectOption>) => {
    this.props.onAuthorsChange(this.props.editorId, selection);
  };

  render() {
    const { formData, selectedAuthors } = this.props;
    // the formData first has to make an initialisation round in Redux.
    if (!formData) return <div>Waiting for initial data...</div>;

    const isLink = formData.type === SourceType.Link;
    const shouldWriteDescription = !isLink || !Boolean(formData.pTitle);

    return (
      <div>
        <Button onClick={this.props.onCancelClick}>← Back </Button>
        Reference: {formData.ref}
        {!isLink && (
          <p>
            <em>
              You're using a manual reference, if possible, use a link. If it's
              a book, link to{" "}
              <a href="https://www.goodreads.com">goodreads.com</a>.
            </em>
          </p>
        )}
        {/* Editable only if it's not a link
         * or if there isn't any auto-generated description  */}
        {shouldWriteDescription ? (
          <Label>
            Description:{" "}
            <input
              onChange={this.onDescriptionChange}
              value={formData.description}
              disabled={!shouldWriteDescription}
            />
          </Label>
        ) : (
          <div>
            Description: {formData.pTitle}
            <br />
            {formData.pDescription}
          </div>
        )}
        {isLink && formData.pAuthor && (
          <div>Detected author(s): {formData.pAuthor}</div>
        )}
        <EntitySearch
          selection={selectedAuthors}
          onChange={this.onAuthorsChange}
          isMulti={true}
        />
        {this.props.onSaveClick && (
          <Button onClick={this.props.onSaveClick}>Save</Button>
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceForm);
