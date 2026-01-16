import { create } from "zustand";
import axiosInstance from "../axios/axiosInstace";
import { toast } from "sonner"



export const useAuthStore = create((set) => ({
    authUser: null,
    isLoading: false,
    isSigningUp: false,
    isLoggingIn: false,

    isCheckingAuth: true,



    checkAuth: async () => {
        set({ isCheckingAuth: true, isLoading: true });
        try {
            const response = await axiosInstance.get("/users/me");
            set({ authUser: response.data, isCheckingAuth: false });
            // toast.success("User Authenticated");
        } catch (error) {
            console.log(error);
            set({ isCheckingAuth: false, authUser: null });
            toast.error("User Not Authenticated");
        } finally {
            set({ isCheckingAuth: false, isLoading: false })
        }
    },
    login: async (formData) => {
        set({ isLoggingIn: true, isLoading: true });
        try {
            const response = await axiosInstance.post("/users/login", formData);
            set({ authUser: response.data.user, isLoggingIn: false });
            toast.success("User Logged In");
        } catch (error) {
            console.log(error);
            set({ isLoggingIn: false, isLoading: false });
            toast.error(error.response?.data?.message || "User Not Logged In");
        } finally {
            set({ isLoggingIn: false, isLoading: false });
        }
    },
    signup: async (formData) => {
        set({ isSigningUp: true, isLoading: true });
        try {
            const response = await axiosInstance.post("/users/register", formData);
            set({ authUser: response.data, isSigningUp: false });
            toast.success("User Signed Up");
        } catch (error) {
            console.log(error);
            set({ isSigningUp: false, isLoading: false });
            toast.error(error.response?.data?.message || "User Not Signed Up");
        } finally {
            set({ isSigningUp: false, isLoading: false });
        }
    },
    logout: async () => {
        set({ isLoading: true });
        try {
            await axiosInstance.post("/users/logout");
            set({ authUser: null, isLoading: false });
            toast.success("Logged out successfully");
        } catch (error) {
            console.log(error);
            set({ isLoading: false });
            toast.error("Logout failed");
        } finally {
            set({ isLoading: false });
        }
    },


}))
