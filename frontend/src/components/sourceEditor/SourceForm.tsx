import React from "react";
import styled from "styled-components";
import { Dispatch, bindActionCreators } from "redux";

import { Source } from "../../utils/types";
import Button from "../Button";
import CONSTS from "../../utils/consts";
import EntitySearch from "../EntitySearch";
import { souDescriptionChange } from "../../features/sourceFormActions";
import { RootAction } from "../../utils/ACTIONS";
import { RootStore } from "../../Store";
import * as sourceFormActions from "../../features/sourceFormActions";
import { connect } from "react-redux";

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
  // const editorId = props.editorId;
  const formData = state.sourceForms[editorId];
  return {
    formData,
    editorId,
    onCancelClick,
    initialSource
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      onDescriptionChange: sourceFormActions.souDescriptionChange,
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
    // this.setState({ description: event.target.value });
  };

  onCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // this.setState({ comment: event.target.value });
  };

  onConfirmationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // this.setState({ confirmation: parseInt(event.target.value) });
  };

  onAuthorsChange = (selection: any) => {
    // console.log(selection);
    // this.setState({
    //   authors: selection
    // });
  };

  render() {
    // Non-editable props should come from the initialSource state
    const { initialSource } = this.props;
    // Editable props should come from formData
    const { formData } = this.props;

    if (!formData) return <div>Waiting for initial data...</div>;

    const isLink = initialSource.type === CONSTS.SOURCE_TYPES.LINK;
    // const confirms = this.state.confirmation === CONSTS.CONFIRMATION.CONFIRMS;
    const shouldWriteDescription = !isLink || !Boolean(initialSource.pTitle);

    return (
      <div>
        Reference: {initialSource.ref}
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
            Description: {initialSource.pTitle}
            <br />
            {initialSource.pDescription}
          </div>
        )}
        {isLink && initialSource.pAuthor && (
          <div>Detected author(s): {initialSource.pAuthor}</div>
        )}
        <EntitySearch
          selection={formData.authors}
          onChange={this.onAuthorsChange}
          isMulti={true}
        />
        {/* <Label>
          Optional comment to summarize or nuance the source
          <textarea
            onChange={this.onCommentChange}
            value={this.state.comment}
          />
        </Label>
        This source
        <span>
          <Label>
            <input
              type="radio"
              name="confirmation"
              value={CONSTS.CONFIRMATION.CONFIRMS}
              checked={Boolean(confirms)}
              onChange={this.onConfirmationChange}
            />
            supports
          </Label>
          <Label>
            <input
              type="radio"
              name="confirmation"
              value={CONSTS.CONFIRMATION.REFUTES}
              checked={!confirms}
              onChange={this.onConfirmationChange}
            />
            refutes
          </Label>
        </span>
        the affirmation. */}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceForm);
