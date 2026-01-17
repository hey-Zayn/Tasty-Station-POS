import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const useUserStore = create((set, get) => ({
    staff: [],
    isLoading: false,
    error: null,

    fetchStaff: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`${API_BASE_URL}/users/staff`, { withCredentials: true });
            set({ staff: response.data.staff, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
            toast.error("Failed to fetch staff");
        }
    },

    createNewStaff: async (staffData) => {
        set({ isLoading: true });
        try {
            const response = await axios.post(`${API_BASE_URL}/users/staff`, staffData, { withCredentials: true });
            set((state) => ({ staff: [...state.staff, response.data.user], isLoading: false }));
            toast.success("Staff created successfully");
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            toast.error(error.response?.data?.message || "Failed to create staff");
            return false;
        }
    },

    updateStaff: async (id, staffData) => {
        set({ isLoading: true });
        try {
            const response = await axios.put(`${API_BASE_URL}/users/staff/${id}`, staffData, { withCredentials: true });
            set((state) => ({
                staff: state.staff.map((s) => (s._id === id ? response.data.user : s)),
                isLoading: false
            }));
            toast.success("Staff updated successfully");
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            toast.error(error.response?.data?.message || "Failed to update staff");
            return false;
        }
    },

    toggleStaffStatus: async (id) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/users/staff/${id}/status`, {}, { withCredentials: true });
            set((state) => ({
                staff: state.staff.map((s) => (s._id === id ? { ...s, isActive: response.data.isActive } : s))
            }));
            toast.success(response.data.message);
        } catch (error) {
            toast.error("Failed to toggle staff status");
        }
    },

    deleteStaff: async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/users/staff/${id}`, { withCredentials: true });
            set((state) => ({ staff: state.staff.filter((s) => s._id !== id) }));
            toast.success("Staff deleted successfully");
        } catch (error) {
            toast.error("Failed to delete staff");
        }
    }
}));

export default useUserStore;
