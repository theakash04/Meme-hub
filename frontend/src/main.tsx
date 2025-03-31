import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SocketProvider } from "./context/socketContext.tsx";
import { CanvasProvider } from "./context/canvaContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <CanvasProvider>
        <App />
      </CanvasProvider>
    </SocketProvider>
  </StrictMode>
);
