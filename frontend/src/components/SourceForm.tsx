import React from "react";
import { Dispatch, bindActionCreators, AnyAction } from "redux";
import { connect } from "react-redux";
import { ValueType } from "react-select/lib/types";

import { Source, ReactSelectOption, SourceType } from "../utils/types";
import { ReactComponent as CloseIcon } from "../assets/ic_close.svg";
import EntitySearch from "./EntitySearch";
import { RootStore } from "../Store";
import * as sourceFormActions from "../features/sourceFormActions";
import Label from "./inputs/Label";
import TextArea from "./inputs/TextArea";
import IconButton from "./buttons/IconButton";
import ButtonBar from "./buttons/ButtonBar";
import EditorContainer from "./layout/EditorContainer";
import TopRightButton from "./buttons/TopRightButton";

type OwnProps = {
  editorId: string;
  initialSource: Source;
  onCancelClick: () => void;
  onSaveClick?: () => void;
};

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
        value: entityKey,
      });
    }
  }
  return {
    formData,
    selectedAuthors,
    ...props,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      onDescriptionChange: sourceFormActions.souDescriptionChange,
      onAuthorsChange: sourceFormActions.souAuthorsChange,
      feedInitialFormData: sourceFormActions.souInitialData,
      clearFormData: sourceFormActions.souClearData,
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

  onDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <EditorContainer withButton>
        <TopRightButton type="button" onClick={this.props.onCancelClick}>
          <CloseIcon />
        </TopRightButton>
        {isLink ? (
          <a href={formData.fullUrl}>
            <strong>{formData.ref}</strong>
          </a>
        ) : (
          <strong>{formData.ref}</strong>
        )}
        {!isLink && (
          <p>
            <em>
              You're using a manual reference, if possible, use a link. If it's
              a book, link to its{" "}
              <a href="https://www.goodreads.com">goodreads.com</a> page.
            </em>
          </p>
        )}
        {/* Editable only if it's not a link
         * or if there isn't any auto-generated description  */}
        {shouldWriteDescription ? (
          <React.Fragment>
            <Label htmlFor="sourceDescription">Description</Label>
            <TextArea
              name="sourceDescription"
              onChange={this.onDescriptionChange}
              value={formData.description}
              disabled={!shouldWriteDescription}
            />
          </React.Fragment>
        ) : (
          <div>
            <Label>Description</Label>
            <p>
              {formData.pTitle}
              <br />
              {formData.pDescription}
            </p>
          </div>
        )}
        {isLink && formData.pAuthor && (
          <div>Detected author(s): {formData.pAuthor}</div>
        )}
        <Label>Authors' entities</Label>
        <EntitySearch
          selection={selectedAuthors}
          onChange={this.onAuthorsChange}
          isMulti={true}
        />
        <ButtonBar buttonsAlign="right">
          {this.props.onSaveClick && (
            <IconButton onClick={this.props.onSaveClick}>Save</IconButton>
          )}
        </ButtonBar>
      </EditorContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceForm);
