import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";

import { RootStore } from "../Store";
import { SourceLink, Status, SourceType } from "../utils/types";
import Meta from "./meta/Meta";
import SourceEntityPreview from "./sourceDetails/SourceEntityPreview";

const Content = styled.div`
  display: block;
  border: 1px solid #333;
  padding: 8px;
`;

const SourceEntitiesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const StyledSourceA = styled.a`
  color: inherit;
  // text-decoration: none;
`;

type OwnProps = {
  sourceLink: SourceLink;
};

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const { sourceLink } = props;
  const sourceKey = sourceLink.sourceKey || "MISSING_SOURCE_KEY";
  const source = state.sources.data[sourceKey];
  const status = state.sources.status[sourceKey];
  const error = state.sources.errors[sourceKey];

  return {
    sourceLink,
    source,
    status,
    error
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({}, dispatch);

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class SourceDetails extends React.Component<Props> {
  render() {
    const { source, status, error } = this.props;
    // Wait for loading
    const meta = <Meta status={status} error={error} />;
    if (status !== Status.Ok) return <Content>{meta}</Content>;
    const isLink: boolean = source.type === SourceType.Link;

    // Separate the domain to bolden it.
    var domain: string = "";
    var refEnd: string = "";
    if (isLink) {
      domain = source.domain as string;
      refEnd = source.ref.replace(domain, ""); // = only the first occurence
    }

    return (
      <Content>
        <div>{source.pTitle || source.description}</div>
        {isLink ? (
          <StyledSourceA href={source.fullUrl}>
            <strong>{domain}</strong>
            {refEnd}
          </StyledSourceA>
        ) : (
          source.ref
        )}
        <SourceEntitiesContainer>
          {source.authors.map(entityKey => (
            <SourceEntityPreview key={entityKey} entityKey={entityKey} />
          ))}
        </SourceEntitiesContainer>
      </Content>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceDetails);
