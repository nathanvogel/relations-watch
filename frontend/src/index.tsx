import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
// Routing
import { BrowserRouter as Router } from "react-router-dom";
// Data
import { Provider } from "react-redux";
import Store from "./Store"; // Use a Maj to let CRA's typescript find it.
// Styles
import "normalize.css";
// i18n
import "./i18n/i18n";
// My files
// import "./index.css";
import App from "./screens/App";
import * as serviceWorker from "./serviceWorker";
import theme from "./styles/theme";
import GlobalStyle from "./styles/GlobalStyle";

if (process.env.NODE_ENV !== "production") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React);
}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={Store}>
      <Router>
        <GlobalStyle />
        <App />
      </Router>
    </Provider>
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
