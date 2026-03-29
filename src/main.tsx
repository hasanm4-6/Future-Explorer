import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initPerformanceOptimizations } from "./lib/performance";
import { sessionManager } from "./lib/session";

// Initialize performance optimizations
initPerformanceOptimizations();

// Initialize session management
sessionManager.loadSession();

createRoot(document.getElementById("root")!).render(<App />);
