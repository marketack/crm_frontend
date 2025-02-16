import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";
import { CustomThemeProvider } from "./theme/CustomThemeProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <CustomThemeProvider>
      <App />
    </CustomThemeProvider>
  </Provider>
);
