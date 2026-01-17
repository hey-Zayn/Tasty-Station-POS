import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const useDashboardStore = create((set) => ({
    dashboardData: null,
    isLoading: false,
    error: null,

    fetchDashboardSummary: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/summary`, { withCredentials: true });
            set({ dashboardData: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    }
}));

export default useDashboardStore;
