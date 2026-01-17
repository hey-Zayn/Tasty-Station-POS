import { create } from "zustand";
import axiosInstance from "../axios/axiosInstace";

export const useOrderStore = create((set, get) => ({
    cart: [],
    isLoading: true,
    error: null,
    lastOrder: null, // For billing slip
    stats: null,
    recentOrders: [],

    addToCart: (menuItem) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.menuItem._id === menuItem._id);

        if (existingItem) {
            set({
                cart: cart.map(item =>
                    item.menuItem._id === menuItem._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            });
        } else {
            set({
                cart: [...cart, { menuItem, quantity: 1, name: menuItem.name, price: menuItem.price }]
            });
        }
    },

    removeFromCart: (menuItemId) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.menuItem._id === menuItemId);

        if (existingItem.quantity > 1) {
            set({
                cart: cart.map(item =>
                    item.menuItem._id === menuItemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
            });
        } else {
            set({
                cart: cart.filter(item => item.menuItem._id !== menuItemId)
            });
        }
    },

    clearCart: () => set({ cart: [] }),

    getStats: async () => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get("/orders/stats");
            set({
                stats: response.data.stats,
                recentOrders: response.data.recentOrders,
                isLoading: false
            });
        } catch (error) {
            console.error("Get stats error:", error);
            set({ isLoading: false, error: "Failed to fetch dashboard stats" });
        }
    },

    getAllOrders: async () => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get("/orders");
            set({ recentOrders: response.data.orders, isLoading: false });
        } catch (error) {
            console.error("Get orders error:", error);
            set({ isLoading: false, error: "Failed to fetch orders" });
        }
    },

    placeOrder: async (orderData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/orders", orderData);
            set({
                isLoading: false,
                lastOrder: response.data.order,
                cart: []
            });
            return { success: true, order: response.data.order };
        } catch (error) {
            console.error("Place order error:", error);
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to place order"
            });
            return { success: false, message: error.response?.data?.message };
        }
    },

    updateOrderStatus: async (orderId, status) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.patch(`/orders/${orderId}/status`, { status });
            const { recentOrders } = get();
            set({
                recentOrders: recentOrders.map(o => o._id === orderId ? response.data.order : o),
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            console.error("Update status error:", error);
            set({ isLoading: false, error: "Failed to update order status" });
            return { success: false, message: error.response?.data?.message };
        }
    },

    resetLastOrder: () => set({ lastOrder: null })
}));
