import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";

import { RootStore } from "../Store";
import { SourceLink, Status, SourceType, SourceLinkType } from "../utils/types";
import Meta from "./meta/Meta";
import SourceEntityPreview from "./sourceDetails/SourceEntityPreview";
import SourceForm from "./SourceForm";
import { patchSource } from "../features/sourcesAC";
import MetaPostStatus from "./meta/MetaPostStatus";
import SourceListItemContainerCSS from "./sourceDetails/SourceListItemContainer";
import IconButton from "./buttons/IconButton";

const SourceListItemContainer = styled.div`
  ${SourceListItemContainerCSS}
`;

const SourceEntitiesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const StyledSourceA = styled.a`
  color: inherit;
  font-size: ${props => props.theme.fontSizeS};
  // text-decoration: none;
`;

const Actions = styled.div`
  float: right;
`;

type OwnProps = {
  sourceKey: string;
  sourceLink: SourceLink;
  editable?: boolean;
};

const getEditorId = (sourceKey: string): string => "souEdit_" + sourceKey;

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { sourceKey } = props;
  const source = state.sources.data[sourceKey];
  const status = state.sources.status[sourceKey];
  const error = state.sources.errors[sourceKey];
  // Get the POST request state from the Redux Store
  const editorId = getEditorId(props.sourceKey);
  const postStatus = state.requests.status[editorId];
  const postError = state.requests.errors[editorId];

  return {
    ...props,
    source,
    status,
    error,
    postStatus,
    postError,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      patchSource,
    },
    dispatch
  );

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class SourceDetails extends React.Component<Props> {
  readonly state = {
    editingSource: false,
  };

  toggleClick = () => {
    this.setState({ editingSource: !this.state.editingSource });
  };

  onSaveSource = () => {
    this.setState({ editingSource: false });
    this.props.patchSource(getEditorId(this.props.sourceKey));
  };

  render() {
    const { source, status, error } = this.props;
    // Wait for loading
    if (status !== Status.Ok)
      return (
        <SourceListItemContainer>
          <Meta status={status} error={error} />
        </SourceListItemContainer>
      );

    const isLink: boolean = source.type === SourceType.Link;
    const { postStatus, postError } = this.props;
    if (this.state.editingSource) {
      return (
        <SourceForm
          initialSource={source}
          onCancelClick={this.toggleClick}
          editorId={getEditorId(this.props.sourceKey)}
          onSaveClick={this.onSaveSource}
        />
      );
    }

    // After editing, but still with a Status:
    if (postStatus !== undefined && postStatus !== Status.Ok)
      return <MetaPostStatus status={postStatus} error={postError} />;

    // Separate the domain to bolden it.
    // var domain: string = "";
    // var refEnd: string = "";
    // if (isLink) {
    //   domain = source.domain as string;
    //   refEnd = source.ref.replace(domain, ""); // = only the first occurence
    //     // <strong>{domain}</strong>
    //     // {refEnd}
    // }
    const fullUrl = this.props.sourceLink.fullUrl || source.fullUrl;
    const sourceText = source.pTitle || source.description;
    return (
      <SourceListItemContainer
        isRefuting={this.props.sourceLink.type === SourceLinkType.Refutes}
      >
        {this.props.editable && (
          <Actions>
            <IconButton onClick={this.toggleClick}>Edit</IconButton>
          </Actions>
        )}
        {sourceText && source._key !== "1379121" && <div>{sourceText}</div>}
        {isLink ? (
          <StyledSourceA href={fullUrl}>
            {source.ref === "www.wikidata.org" ? fullUrl : source.ref}
          </StyledSourceA>
        ) : (
          <strong>{source.ref}</strong>
        )}
        {source.authors && source.authors.length > 0 && (
          <SourceEntitiesContainer>
            {source.authors.map(entityKey => (
              <SourceEntityPreview key={entityKey} entityKey={entityKey} />
            ))}
          </SourceEntitiesContainer>
        )}
      </SourceListItemContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceDetails);
