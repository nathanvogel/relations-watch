import React from "react";
import styled from "styled-components";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ValueType } from "react-select/lib/types";

import { Source, ReactSelectOption } from "../../utils/types";
import Button from "../buttons/Button";
import CONSTS from "../../utils/consts";
import EntitySearch from "../EntitySearch";
import { RootAction } from "../../utils/ACTIONS";
import { RootStore } from "../../Store";
import * as sourceFormActions from "../../features/sourceFormActions";

type OwnProps = {
  editorId: string;
  initialSource: Source;
  onCancelClick: () => void;
};

const Label = styled.label`
  display: block;
`;

const Content = styled.div`
  display: block;
`;

const mapStateToProps = (
  state: RootStore,
  { editorId, onCancelClick, initialSource }: OwnProps
) => {
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
    editorId,
    onCancelClick,
    initialSource
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      onDescriptionChange: sourceFormActions.souDescriptionChange,
      onAuthorsChange: sourceFormActions.souAuthorsChange,
      feedInitialFormData: sourceFormActions.souInitialData
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
    // TODO : clear state
  }

  onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onDescriptionChange(this.props.editorId, event.target.value);
  };

  onAuthorsChange = (selection: any) => {
    this.props.onAuthorsChange(this.props.editorId, selection);
  };

  render() {
    const { formData, selectedAuthors } = this.props;
    // the formData first has to make an initialisation round in Redux.
    if (!formData) return <div>Waiting for initial data...</div>;

    const isLink = formData.type === CONSTS.SOURCE_TYPES.LINK;
    const shouldWriteDescription = !isLink || !Boolean(formData.pTitle);

    return (
      <div>
        Reference: {formData.ref}
        <Button onClick={this.props.onCancelClick}>Edit ref</Button>
        {!isLink && (
          <p>
            <em>
              You're using a manual reference, if possible, use a link. If the
              source is a book, link toward the Amazon page of the book. (Read
              on why Amazon?)
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
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceForm);
