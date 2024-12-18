import { useState } from "react";

export const useRowSelection = () => {
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

    const toggleRowSelection = (rows: any[]) => {
        const newSelection = { ...selectedRows };
        rows.forEach((row) => {
            newSelection[row.id] = !selectedRows[row.id];
        });
        setSelectedRows(newSelection);
    };

    const isSelected = (row: any) => !!selectedRows[row.id];

    return { selectedRows, toggleRowSelection, isSelected };
};
