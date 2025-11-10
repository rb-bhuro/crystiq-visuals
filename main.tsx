import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Attach the app to the HTML root div
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
