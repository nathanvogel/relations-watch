import { createGlobalStyle } from "styled-components";
import { TP } from "./utils/theme";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: ${(props: TP) => props.theme.mainFont};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.4;
    color: ${(props: TP) => props.theme.mainTextColor};
    font-size: ${(props: TP) => props.theme.fontSizeM};
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
  }

  svg .interaction {
    cursor: pointer;
  }

  svg .nodes g:hover text {
    text-decoration: underline;
  }

  p {
    margin-top: 0.25em;
    margin-bottom: 0.5em;
  }
`;

export default GlobalStyle;
