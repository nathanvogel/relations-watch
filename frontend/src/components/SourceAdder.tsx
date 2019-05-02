import React from "react";
import styled from "styled-components";

import { Edge, SourceLink, SourceLinkType } from "../utils/types";
import SourceSelector from "./SourceSelector";
import SourceDetails from "./SourceDetails";
import Button from "./buttons/Button";
import { RootStore } from "../Store";
import { Dispatch, AnyAction, bindActionCreators } from "redux";
import { saveEdge } from "../features/edgesSaveAC";
import { loadSources } from "../features/sourcesAC";

const Content = styled.div`
  display: block;
`;

const Label = styled.label`
  display: block;
`;

type OwnProps = {
  onDoneAdding: () => void;
  edge: Edge;
  editorId: string;
  sourceEditorId: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (_state: RootStore, props: OwnProps) => props;

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      saveEdge,
      loadSources
    },
    dispatch
  );

type State = {
  comment: string;
  sourceKey?: string;
};

class SourceAdder extends React.Component<Props> {
  readonly state: State = {
    comment: "",
    sourceKey: undefined
  };

  onCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ comment: event.target.value });
  };

  onSourceSelected = (sourceKey: string) => {
    // One day, loadSources will handle not re-requesting sources.
    this.props.loadSources([sourceKey], true);
    this.setState({ sourceKey });
  };

  onSourceDeselected = () => {
    this.setState({ sourceKey: undefined });
  };

  onRefutingSubmit = () => {
    this.submit(false);
  };

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.submit(true);
  };

  submit = (confirms: boolean) => {
    const { sourceKey, comment } = this.state;
    const { edge, editorId, sourceEditorId } = this.props;

    const sourceLink: SourceLink = {
      comments: comment ? [{ t: comment }] : [],
      type: confirms ? SourceLinkType.Confirms : SourceLinkType.Refutes,
      sourceKey: sourceKey
    };

    this.props.saveEdge(editorId, edge, sourceLink, sourceEditorId);
  };

  render() {
    return (
      <Content>
        <form onSubmit={this.onSubmit}>
          {this.state.sourceKey ? (
            <React.Fragment>
              <SourceDetails sourceKey={this.state.sourceKey} />
              <Button onClick={this.onSourceDeselected}>
                Pick another source
              </Button>
            </React.Fragment>
          ) : (
            <SourceSelector
              onSourceSelected={this.onSourceSelected}
              editorId={this.props.sourceEditorId}
            />
          )}
          <Label>
            Comment
            <textarea
              onChange={this.onCommentChange}
              value={this.state.comment}
            />
          </Label>
          <button type="submit">Save</button>
          <button type="button" onClick={this.onRefutingSubmit}>
            Save with refuting source
          </button>
        </form>
      </Content>
    );
  }
}

export default SourceAdder;
