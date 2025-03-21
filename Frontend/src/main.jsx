import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import './index.css'
import { OnlineStatusProvider } from "./components/OnlineStatusContext";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <OnlineStatusProvider>
    <App />
    </OnlineStatusProvider>
  </BrowserRouter>
);
