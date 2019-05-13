import { createGlobalStyle, css } from "styled-components";
import { TP } from "./utils/theme";

// Put the CSS in a separate css template to get babel coloring
const GlobalStyleCSS = css`
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
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
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

  a:link {
    color: ${(props: TP) => props.theme.linkTextColor};
    text-decoration: none;
  }
  a:visited {
    color: ${(props: TP) => props.theme.visitedLinkTextColor};
  }
  a:hover {
    color: ${(props: TP) => props.theme.hoverLinkTextColor};
    text-decoration: underline;
  }
  a:active {
    color: ${(props: TP) => props.theme.linkTextColor};
  }
`;

const GlobalStyle = createGlobalStyle`
  ${GlobalStyleCSS}
`;

export default GlobalStyle;
