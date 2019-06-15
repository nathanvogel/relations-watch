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

  a:focus,
  a:not([disabled]):hover:focus {
    color: ${props => props.theme.focusColor};
    border-color: ${props => props.theme.focusColor};
    border-radius: ${props => props.theme.smallRadius}
    box-shadow: ${props => props.theme.focusShadow};
    outline: none;
  }

  .rs__menu {
    margin-top: 0px;
    margin-bottom: 0px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    border-bottom-left-radius: ${props => props.theme.smallRadius};
    border-bottom-right-radius: ${props => props.theme.smallRadius};
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);

    // To render correctly in the portal
    z-index: 5200;
    pointer-events: all;

    .rs__menu-list {
      padding-top: 0px;
      padding-bottom: 0px;

      .rs__option {
        box-sizing: border-box;
        background-color: ${props => props.theme.appBG};
        border-color: ${props => props.theme.appBG};
        border-width: ${props => props.theme.borderWidth};
        border-style: solid;
        border-radius: 0px;
        padding-top: ${props => props.theme.inputPaddingTB};
        padding-bottom: ${props => props.theme.inputPaddingTB};
        color: ${props => props.theme.mainTextColor};
      }

      .rs__option--is-focused {
        border-color: ${props => props.theme.borderHover};
        border-radius: ${props => props.theme.smallRadius};
      }

      .rs__option--is-selected {
        color: ${props => props.theme.mainTextColor};
        background-color: ${props => props.theme.inputBG};
      }
    }
  }


  ::-webkit-scrollbar {
      background-color: ${props => props.theme.appBG};
      width: 14px;
      height: 14px;
  }
  ::-webkit-scrollbar-button {
      display: none;
      background-color: ${props => props.theme.appBG};
  }
  ::-webkit-scrollbar-thumb {
      background-color: #c8c8c8;
      border-radius: 10px;
      border: 3px solid ${props => props.theme.appBG};
  }
  ::-webkit-scrollbar-thumb:hover {
      background-color: #868686
  }
  ::-webkit-scrollbar-track {
      background-color: ${props => props.theme.appBG};
  }
`;

const GlobalStyle = createGlobalStyle`
  ${GlobalStyleCSS}
`;

export default GlobalStyle;
