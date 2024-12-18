import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "primereact/resources/themes/saga-blue/theme.css";  // PrimeReact theme
import "primereact/resources/primereact.min.css";         // PrimeReact core styles
import "primeicons/primeicons.css";                      // PrimeReact icons
import "./index.css";                                    // Global styles

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
