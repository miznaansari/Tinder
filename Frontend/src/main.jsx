import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import './index.css';
import { OnlineStatusProvider } from "./components/OnlineStatusContext";
import MyProvider from "./context/MyProvider";

// 👉 Add this line to register service worker
import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {
    if (confirm("A new version is available. Reload to update?")) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log("App is ready to work offline.");
  },
});

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <MyProvider>
      <OnlineStatusProvider>
        <App />
      </OnlineStatusProvider>
    </MyProvider>
  </BrowserRouter>
);
