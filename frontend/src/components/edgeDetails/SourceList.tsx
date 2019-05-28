import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { SourceLink, SourceLinkType } from "../../utils/types";
import SourceDetails from "../SourceDetails";

interface HeadProps {
  isRefuting: boolean;
}

const Head = styled.h5<HeadProps>`
  color: ${props =>
    props.isRefuting
      ? props.theme.refutingTextColor
      : props.theme.mainTextColor};
  margin-top: ${props => props.theme.marginTB};
  margin-bottom: -12px;
  text-transform: uppercase;
  font-weight: normal;
  font-size: ${props => props.theme.fontSizeS};
`;

type Props = {
  sources: SourceLink[];
};

const SourceList: FunctionComponent<Props> = ({ sources }: Props) => {
  if (!sources || sources.length === 0)
    return (
      <Head isRefuting={false}>
        <em>UNSOURCED INFORMATION</em>
      </Head>
    );
  const confirmingSources: SourceLink[] = sources.filter(
    s => s.type === SourceLinkType.Confirms
  );
  const refutingSources: SourceLink[] = sources.filter(
    s => s.type === SourceLinkType.Refutes
  );

  const renderSource = (sourceLink: SourceLink, index: number) => (
    <SourceDetails
      // Need the index because sourceLink doesn't have its own key
      // and we can link the same source multiple times
      key={sourceLink.sourceKey + index.toString()}
      sourceKey={sourceLink.sourceKey || "MISSING_SOURCE_KEY"}
      sourceLink={sourceLink}
    />
  );

  return (
    <div>
      {confirmingSources.length > 0 && <Head isRefuting={false}>Sources</Head>}
      {confirmingSources.map(renderSource)}
      {refutingSources.length > 0 && (
        <Head isRefuting={true}>Refuting sources</Head>
      )}
      {refutingSources.map(renderSource)}
    </div>
  );
};

export default SourceList;
