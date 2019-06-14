import { createGlobalStyle, css } from "styled-components";

// Put the CSS in a separate css template to get babel coloring
const GlobalStyleCSS = css`
  body {
    margin: 0;
    padding: 0;
    font-family: ${props => props.theme.mainFont};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: ${props => props.theme.lineHeight}
    color: ${props => props.theme.mainTextColor};
    font-size: ${props => props.theme.fontSizeM};
  }

  #modals {
    width: 100%;
    height: 100%;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }

  p {
    margin-top: 0.25em;
    margin-bottom: 0.5em;
  }

  a:link {
    color: ${props => props.theme.linkTextColor};
    text-decoration: none;
  }
  a:visited {
    color: ${props => props.theme.visitedLinkTextColor};
  }
  a:hover {
    color: ${props => props.theme.hoverLinkTextColor};
    text-decoration: underline;
  }
  a:active {
    color: ${props => props.theme.linkTextColor};
  }
`;

const GlobalStyle = createGlobalStyle`
  ${GlobalStyleCSS}
`;

export default GlobalStyle;
