import React from "react";
import styled from "styled-components";

import { Source } from "../../utils/types";
import Button from "../Button";
import CONSTS from "../../utils/consts";
import EntitySearch from "../EntitySearch";

type Props = {
  initialSource: Source;
  onCancelClick: () => void;
};

const Label = styled.label`
  display: block;
`;

const Content = styled.div`
  display: block;
`;

class SourceForm extends React.Component<Props> {
  static defaultProps = {
    initialSource: {
      ref: "",
      type: 1,
      // Corresponds to the react-select value
      authors: [],
      fullUrl: "",
      description: "",
      pTitle: "",
      pAuthor: "",
      pDescription: "",
      rootDomain: "",
      domain: ""
    }
  };

  readonly state = {
    ref: this.props.initialSource.ref,
    type: this.props.initialSource.type,
    authors: this.props.initialSource.authors,
    fullUrl: this.props.initialSource.fullUrl,
    description: this.props.initialSource.description,
    comment: "",
    confirmation: CONSTS.CONFIRMATION.CONFIRMS
  };

  onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: event.target.value });
  };

  onCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ comment: event.target.value });
  };

  onConfirmationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ confirmation: parseInt(event.target.value) });
  };

  onAuthorsChange = (selection: any) => {
    console.log(selection);
    this.setState({
      authors: selection
    });
  };

  render() {
    const { initialSource } = this.props;
    const isLink = this.state.type === CONSTS.SOURCE_TYPES.LINK;
    const confirms = this.state.confirmation === CONSTS.CONFIRMATION.CONFIRMS;
    const shouldWriteDescription = !isLink || !Boolean(initialSource.pTitle);

    return (
      <div>
        Reference: {this.state.ref}
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
              value={this.state.description}
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
          selection={this.state.authors}
          onChange={this.onAuthorsChange}
          isMulti={true}
        />
        <Label>
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
        the affirmation.
      </div>
    );
  }
}

export default SourceForm;
