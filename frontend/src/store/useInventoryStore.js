import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner"

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api";

export const useInventoryStore = create((set, get) => ({
    items: [],
    stats: null,
    isLoading: false,
    error: null,

    fetchInventory: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`${API_URL}/inventory`);
            set({ items: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error fetching inventory", isLoading: false });
            toast.error(get().error);
        }
    },

    fetchReports: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`${API_URL}/inventory/reports`);
            set({ stats: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error fetching reports", isLoading: false });
            toast.error(get().error);
        }
    },

    addStockItem: async (itemData) => {
        set({ isLoading: true });
        try {
            const response = await axios.post(`${API_URL}/inventory`, itemData);
            set((state) => ({
                items: [response.data.data, ...state.items],
                isLoading: false
            }));
            toast.success("Item added successfully");
            get().fetchReports();
        } catch (error) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Error adding item");
        }
    },

    updateStockItem: async (id, updateData) => {
        try {
            const response = await axios.put(`${API_URL}/inventory/${id}`, updateData);
            set((state) => ({
                items: state.items.map((item) => (item._id === id ? response.data.data : item)),
            }));
            toast.success("Item updated successfully");
            get().fetchReports();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating item");
        }
    },

    deleteStockItem: async (id) => {
        try {
            await axios.delete(`${API_URL}/inventory/${id}`);
            set((state) => ({
                items: state.items.filter((item) => item._id !== id),
            }));
            toast.success("Item deleted successfully");
            get().fetchReports();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting item");
        }
    },
}));
