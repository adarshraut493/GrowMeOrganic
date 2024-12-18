import axios from "axios";
import { Artwork } from "../types/Artwork";

const API_URL = "https://api.artic.edu/api/v1/artworks";

export const fetchArtworks = async (page: number): Promise<Artwork[]> => {
    try {
        const response = await axios.get(`${API_URL}?page=${page}`);
        return response.data.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            place_of_origin: item.place_of_origin,
            artist_display: item.artist_display,
            inscriptions: item.inscriptions,
            date_start: item.date_start,
            date_end: item.date_end,
        }));
    } catch (error) {
        console.error("Error fetching artworks:", error);
        return [];
    }
};
