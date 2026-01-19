import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const useClientStore = create((set) => ({
    clients: [],
    selectedClient: null,
    isLoading: false,
    error: null,
    pagination: {
        totalClients: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    },

    fetchClients: async (page = 1, limit = 10) => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`${API_BASE_URL}/clients?page=${page}&limit=${limit}`, { withCredentials: true });
            set({
                clients: response.data.clients,
                pagination: response.data.pagination,
                isLoading: false
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
            toast.error("Failed to fetch customers");
        }
    },

    fetchClientHistory: async (id) => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`${API_BASE_URL}/clients/${id}/history`, { withCredentials: true });
            set({ selectedClient: response.data.client, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
            toast.error("Failed to fetch customer history");
        }
    },

    deleteClient: async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/clients/${id}`, { withCredentials: true });
            set((state) => ({ clients: state.clients.filter((c) => c._id !== id) }));
            toast.success("Customer record removed");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete customer");
        }
    },

    clearSelectedClient: () => set({ selectedClient: null })
}));

export default useClientStore;
