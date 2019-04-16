import React from "react";
import ReactDOM from "react-dom";
// Routing
import { BrowserRouter as Router } from "react-router-dom";
// Data
import { Provider } from "react-redux";
import Store from "./Store"; // Use a Maj to let CRA's typescript find it.
// Styles
import "normalize.css";
// My files
import "./index.css";
import App from "./screens/App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Provider store={Store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
