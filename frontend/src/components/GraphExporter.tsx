import React from "react";
import styled from "styled-components";
import IconButton from "./buttons/IconButton";
import exportStyledSVG from "../utils/snippets/export-svg";
import printElement from "../utils/snippets/printElement";
import ButtonBar from "./buttons/ButtonBar";

const Content = styled.div`
  margin-top: 24px;
`;

type Props = {};

class GraphExporter extends React.Component<Props> {
  readonly state = {
    blob: null,
  };

  onExportSVG = () => {
    const element = document.getElementsByClassName("main-graph")[0];
    exportStyledSVG(element);
  };

  onExportPDF = () => {
    const element = document.getElementsByClassName("main-graph")[0];
    printElement(element);
  };

  render() {
    return (
      <Content>
        <ButtonBar>
          {/* <IconButton withText onClick={this.onExportSVG}>
            Save SVG
          </IconButton> */}
          <IconButton withText onClick={this.onExportPDF}>
            Save PDF
          </IconButton>
        </ButtonBar>
      </Content>
    );
  }
}

export default GraphExporter;
