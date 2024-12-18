import { useState, useEffect } from "react";
import { fetchArtworks } from "../services/api";
import { Artwork } from "../types/Artwork";

export const usePaginationHandler = () => {
    const [data, setData] = useState<Artwork[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchPage = async (page: number) => {
        setLoading(true);
        try {
            const response = await fetchArtworks(page);
            setData(response);
            setTotalRecords(100000); // Adjust as needed
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPage(1);
    }, []);

    return { data, totalRecords, loading, fetchPage };
};
