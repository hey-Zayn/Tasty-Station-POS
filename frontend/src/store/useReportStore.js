import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const useReportStore = create((set) => ({
    salesData: [],
    cashierData: [],
    topItemsData: [],
    profitLossData: { totalRevenue: 0, totalCost: 0, profit: 0, orderCount: 0 },
    isLoading: false,
    error: null,

    fetchSalesReports: async (filter = "daily") => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`${API_BASE_URL}/reports/sales?filter=${filter}`, { withCredentials: true });
            set({ salesData: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchCashierCollections: async (filter = "daily") => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`${API_BASE_URL}/reports/cashier-collections?filter=${filter}`, { withCredentials: true });
            set({ cashierData: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchTopSellingItems: async (filter = "daily", limit = 10) => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`${API_BASE_URL}/reports/top-selling?filter=${filter}&limit=${limit}`, { withCredentials: true });
            set({ topItemsData: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchProfitLoss: async (filter = "monthly") => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`${API_BASE_URL}/reports/profit-loss?filter=${filter}`, { withCredentials: true });
            set({ profitLossData: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },
}));

export default useReportStore;
