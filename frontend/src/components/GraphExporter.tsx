import React from "react";
import SaveIcon from "@material-ui/icons/SaveAlt";
import IconButton from "./buttons/IconButton";
import exportStyledSVG from "../utils/snippets/export-svg";
import printElements from "../utils/snippets/printElement";
import ButtonBar from "./buttons/ButtonBar";

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
    const graph = document.getElementsByClassName("main-graph")[0];
    const legend = document.getElementById("graph-legend");
    const elements: Element[] = [graph];
    if (legend) console.log(legend, legend.dataset, legend.dataset.hidden);
    if (legend && legend.dataset.hidden == "false") {
      console.log("HIDDEN data!");
      elements.push(legend);
    }

    printElements(elements);
  };

  render() {
    return (
      <ButtonBar>
        {/* <IconButton withText onClick={this.onExportSVG}>
            Save SVG
          </IconButton> */}
        <IconButton withText onClick={this.onExportPDF}>
          <SaveIcon />
          Save PDF
        </IconButton>
      </ButtonBar>
    );
  }
}

export default GraphExporter;
