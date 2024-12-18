import React, { useState, useEffect, useRef } from "react";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Checkbox } from "primereact/checkbox";

const ArtworkTable: React.FC = () => {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageSelectedRows, setPageSelectedRows] = useState<Record<number, any[]>>({});
  const [bulkSelectCount, setBulkSelectCount] = useState<number>(0);
  const overlayRef = useRef<OverlayPanel>(null);

  // Fetch artworks dynamically for the given page
  const fetchData = async (currentPage: number): Promise<any> => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${currentPage + 1}&limit=12`
      );
      const data = await response.json();
      return {
        artworks: data.data || [],
        totalRecords: data.pagination?.total || 0,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { artworks: [], totalRecords: 0 };
    } finally {
      setLoading(false);
    }
  };

  // Load data when the component mounts or the page changes
  useEffect(() => {
    const loadPageData = async () => {
      const { artworks, totalRecords } = await fetchData(page);
      setArtworks(artworks);
      setTotalRecords(totalRecords);
    };
    loadPageData();
  }, [page]);

  // Handle pagination changes
  const onPageChange = (event: DataTablePageEvent) => {
    setPage(event.page ?? 0);
  };

  // Toggle row selection
  const handleRowSelectionToggle = (rowData: any) => {
    setPageSelectedRows((prevState) => {
      const currentSelection = prevState[page] || [];
      const isSelected = currentSelection.some((row) => row.id === rowData.id);

      if (isSelected) {
        // If already selected, remove from selection
        return {
          ...prevState,
          [page]: currentSelection.filter((row) => row.id !== rowData.id),
        };
      } else {
        // Otherwise, add to selection
        return {
          ...prevState,
          [page]: [...currentSelection, rowData],
        };
      }
    });
  };

  // Toggle select all rows for the current page
  const handleSelectAllToggle = (selectAll: boolean) => {
    if (selectAll) {
      setPageSelectedRows((prevState) => ({
        ...prevState,
        [page]: [...artworks],
      }));
    } else {
      setPageSelectedRows((prevState) => ({
        ...prevState,
        [page]: [],
      }));
    }
  };

  // Bulk row selection logic
  const handleBulkSelectionSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    const rowsPerPage = 12;

    // Determine rows to select from the current page
    const currentPageRows = artworks.slice(0, Math.min(bulkSelectCount, rowsPerPage));
    const remainingCount = bulkSelectCount - currentPageRows.length;

    // Update the selected rows for the current page
    setPageSelectedRows((prevState) => ({
      ...prevState,
      [page]: currentPageRows,
    }));

    // Fetch additional rows from subsequent pages
    let nextPage = page + 1;
    let additionalRows: Record<number, any[]> = {};
    let rowsFetched = 0;

    while (remainingCount > rowsFetched) {
      const { artworks: nextPageData } = await fetchData(nextPage);
      if (nextPageData.length === 0) break;

      const rowsFromNextPage = nextPageData.slice(0, remainingCount - rowsFetched);
      additionalRows[nextPage] = rowsFromNextPage;
      rowsFetched += rowsFromNextPage.length;
      nextPage++;
    }

    // Update selected rows for subsequent pages
    setPageSelectedRows((prevState) => ({
      ...prevState,
      ...additionalRows,
    }));

    overlayRef.current?.hide();
  };

  // Determine selected rows for the current page
  const selectedRowsForCurrentPage = pageSelectedRows[page] || [];
  const isAllSelected = selectedRowsForCurrentPage.length === artworks.length;

  // Header checkbox with overlay for bulk selection
  const headerCheckbox = () => {
    return (
      <>
        <Checkbox
          type="checkbox"
          checked={isAllSelected}
          onClick={(e) => handleSelectAllToggle(e.target.checked)}
          style={{
            marginRight: "8px",
            width: "24px", // Increased size
            height: "24px", // Increased size
            cursor: "pointer",
          }}
        />
        <Button
          icon="pi pi-chevron-down"
          onClick={(e) => overlayRef.current?.toggle(e)}
        />
      </>
    );
  };

  const rowSelectionCheckbox = (rowData: any) => {
    const isSelected =
      selectedRowsForCurrentPage.some((row) => row.id === rowData.id) || false;

    return (
      <Checkbox
        checked={isSelected}
        onChange={() => handleRowSelectionToggle(rowData)}
        style={{ cursor: "pointer" }}
      />
    );
  };

  return (
    <div className="p-m-4">
      <h3>Paginated Artwork Table</h3>
      <DataTable
        value={artworks}
        paginator
        lazy
        rows={12}
        totalRecords={totalRecords}
        first={page * 12}
        onPage={onPageChange}
        loading={loading}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      >
        <Column header={headerCheckbox} body={rowSelectionCheckbox} style={{ width: "10rem"  }} />
        <Column field="title" header="Title" />
        <Column field="artist_display" header="Artist" />
        <Column field="place_of_origin" header="Origin" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
        <Column
          field="inscriptions"
          header="Inscriptions"
          body={(rowData) => rowData.inscriptions || "No inscriptions"}
        />
      </DataTable>

      <OverlayPanel ref={overlayRef}>
        <div className="p-d-flex p-ai-center p-flex-column">
          <h5>Select Rows</h5>
          <InputNumber
            value={bulkSelectCount}
            onValueChange={(e) => setBulkSelectCount(e.value || 0)}
            placeholder="Enter number of rows"
            min={1}
          />
          <Button
            label="Submit"
            icon="pi pi-check"
            onClick={handleBulkSelectionSubmit}
            className="p-mt-2"
          />
        </div>
      </OverlayPanel>
    </div>
  );
};

export default ArtworkTable;
