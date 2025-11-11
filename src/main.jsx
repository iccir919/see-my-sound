import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SpotifyProvider } from "./context/SpotifyContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
      <SpotifyProvider>
        <App />
      </SpotifyProvider>
    </StrictMode>

);