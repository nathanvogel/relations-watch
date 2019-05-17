import React from "react";
import styled from "styled-components";

import { media } from "../../styles/media-styles";

const Content = styled.div`
  display: flex;
  ${media.mobile`display: block;`}
`;

const SourcesColumn = styled.div`
  flex: 1;
`;

const ColumnTitle = styled.h5`
  background-color: ${props => props.color};
  font-size: 12px;
  font-weight: 400;
  padding-left: 4px;
  padding-right: 4px;
  margin-left: -4px;
  margin-right: 12px;
  margin-top: 0px;
  margin-bottom: 0px;
`;

const SourceText = styled.p`
  font-size: 12px;
  margin-top: 8px;
  margin-bottom: 4px;
`;

const EmptyInfo = styled.em`
  opacity: 0.35;
`;

type OwnProps = {
  confirmSources: string[];
  refuteSources: string[];
};

class Sources extends React.Component<OwnProps> {
  render() {
    const { confirmSources, refuteSources } = this.props;
    const hasProSource = confirmSources.length > 0;
    const hasAntiSource = refuteSources.length > 0;

    return (
      <Content>
        {!hasProSource && !hasAntiSource ? (
          <SourceText>
            <em>Unsourced information</em>
          </SourceText>
        ) : (
          <React.Fragment>
            <SourcesColumn>
              <ColumnTitle color="#E5FFD9">Sources</ColumnTitle>
              {confirmSources.map((text, index) => (
                <SourceText key={index.toString()}>{text}</SourceText>
              ))}
              {hasProSource ? null : (
                <SourceText>
                  <EmptyInfo>-- None --</EmptyInfo>
                </SourceText>
              )}
            </SourcesColumn>
            <SourcesColumn>
              <ColumnTitle color="#FFDCD8">Counter-sources</ColumnTitle>
              {refuteSources.map((text, index) => (
                <SourceText key={index.toString()}>{text}</SourceText>
              ))}
              {hasAntiSource ? null : (
                <SourceText>
                  <EmptyInfo>-- None --</EmptyInfo>
                </SourceText>
              )}
            </SourcesColumn>
          </React.Fragment>
        )}
      </Content>
    );
  }
}

export default Sources;
