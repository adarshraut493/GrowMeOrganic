import React from "react";
import DataTableComponent from "./components/DataTable";

const App: React.FC = () => {
    return (
        <div className="app">
            <h1>Artworks</h1>
            <DataTableComponent />
        </div>
    );
};

export default App;
