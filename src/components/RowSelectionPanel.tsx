import React from "react";

const RowSelectionPanel: React.FC<{ selectedRows: any[] }> = ({ selectedRows }) => {
    return (
        <div className="row-selection-panel">
            <h3>Selected Rows</h3>
            <ul>
                {selectedRows.map((row) => (
                    <li key={row.id}>{row.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default RowSelectionPanel;
