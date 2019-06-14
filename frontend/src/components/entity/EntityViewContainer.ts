import styled from "styled-components";

const EntityPreviewContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;

  & > img {
    margin-top: 4px;
  }

  & > div {
    max-width: 100%;

    > * {
      max-width: 100%;
    }
  }
`;

export default EntityPreviewContainer;
