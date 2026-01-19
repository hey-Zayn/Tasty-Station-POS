import React, { useEffect, useState, useMemo } from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { AnimatePresence, motion } from 'framer-motion';

// Component Imports
import OrderTerminalHeader from '../components/OrderTerminalHeader';
import OrderCardView from '../components/OrderCardView';
import OrderTableView from '../components/OrderTableView';
import OrderSummarySidebar from '../components/OrderSummarySidebar';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/ui/custom-pagination';

const Dishes = () => {
    const { recentOrders, getAllOrders, updateOrderStatus, isLoading, pagination } = useOrderStore();
    const [viewMode, setViewMode] = useState('card'); // 'card' | 'table'
    const [filter, setFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        getAllOrders(1, 10);
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        const poll = setInterval(() => {
            // Only poll for the first page to see new orders
            // If the user is on a different page, polling might be disruptive
            // For now, let's keep it simple.
            getAllOrders(pagination?.currentPage || 1, 10);
        }, 15000);
        return () => {
            clearInterval(timer);
            clearInterval(poll);
        };
    }, [getAllOrders]);

    // Handle initial selection or clearing if orders change
    useEffect(() => {
        if (selectedOrder) {
            const updated = recentOrders.find(o => o._id === selectedOrder._id);
            if (updated) {
                if (JSON.stringify(updated) !== JSON.stringify(selectedOrder)) {
                    setSelectedOrder(updated);
                }
            } else {
                setSelectedOrder(null);
            }
        }
    }, [recentOrders, selectedOrder]);

    const filteredOrders = useMemo(() => {
        return recentOrders.filter(order => {
            const matchesSearch =
                (order.orderId?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (order.clientName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (order.clientPhone?.includes(searchTerm));
            const orderStatus = typeof order.status === 'object' ? order.status?.name : order.status;
            const matchesFilter = filter === "All" || orderStatus === filter;
            return matchesSearch && matchesFilter;
        });
    }, [recentOrders, searchTerm, filter]);

    const handlePageChange = (newPage) => {
        getAllOrders(newPage, 10);
    };

    const stats = useMemo(() => ({
        total: recentOrders.length,
        pending: recentOrders.filter(o => o.status === "Pending").length,
        preparing: recentOrders.filter(o => o.status === "Preparing").length,
        ready: recentOrders.filter(o => o.status === "Ready").length,
        completed: recentOrders.filter(o => o.status === "Completed").length,
        cancelled: recentOrders.filter(o => o.status === "Cancelled").length,
    }), [recentOrders]);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0F1113] p-4 md:p-8 overflow-x-hidden transition-colors duration-500">
            <div className="max-w-[1800px] mx-auto">
                <OrderTerminalHeader
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    filter={filter}
                    setFilter={setFilter}
                    stats={stats}
                    isLoading={isLoading}
                    onRefresh={getAllOrders}
                    currentTime={currentTime}
                />

                <div className="flex flex-col lg:flex-row gap-8 items-start relative min-h-[60vh]">
                    {/* Main Listing Area */}
                    <main className={`flex-1 min-w-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${selectedOrder ? 'lg:mr-[450px]' : ''}`}>
                        <AnimatePresence mode="wait">
                            {isLoading && recentOrders.length === 0 ? (
                                <motion.div
                                    key="loader"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col items-center justify-center  h-[50vh] space-y-8"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-teal-500 blur-[80px] opacity-20 animate-pulse" />
                                        <div className="relative bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl ring-1 ring-black/5">
                                            <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">Initializing Terminal</h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mt-3">Connecting to secure order vault...</p>
                                    </div>
                                </motion.div>
                            ) : filteredOrders.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col items-center justify-center h-[50vh] bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-[3.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800"
                                >
                                    <div className="p-8 bg-amber-50 dark:bg-amber-900/20 rounded-full text-amber-600 mb-8 font-bold flex items-center justify-center shadow-inner">
                                        <AlertCircle size={48} />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter uppercase italic">Clear Skies</h3>
                                    <p className="text-gray-400 font-bold text-sm uppercase tracking-[0.25em]">No tickets found in the current flight path</p>
                                    <Button
                                        onClick={() => { setFilter("All"); setSearchTerm(""); }}
                                        className="mt-10 px-8 h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-600/20 transition-all hover:scale-105"
                                    >
                                        Reset All Filters
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={viewMode}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                >
                                    <div className="space-y-6">
                                        {viewMode === 'card' ? (
                                            <OrderCardView
                                                orders={filteredOrders}
                                                selectedOrderId={selectedOrder?._id}
                                                onSelectOrder={setSelectedOrder}
                                            />
                                        ) : (
                                            <OrderTableView
                                                orders={filteredOrders}
                                                selectedOrderId={selectedOrder?._id}
                                                onSelectOrder={setSelectedOrder}
                                            />
                                        )}
                                        <Pagination
                                            pagination={pagination}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>

                    {/* Detail Sidebar Area */}
                    <AnimatePresence>
                        {selectedOrder && (
                            <>
                                {/* Mobile Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setSelectedOrder(null)}
                                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] lg:hidden"
                                />

                                <motion.aside
                                    initial={{ x: '100%', opacity: 0.5 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: '100%', opacity: 0 }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] lg:fixed lg:right-8 lg:top-[180px] lg:h-[calc(100vh-220px)] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] lg:shadow-none"
                                >
                                    <div className="h-full">
                                        <OrderSummarySidebar
                                            order={selectedOrder}
                                            onClose={() => setSelectedOrder(null)}
                                            onUpdateStatus={updateOrderStatus}
                                        />
                                    </div>
                                </motion.aside>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Global Style Inject for custom scrollbars */}
            <style jsx="true">{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1E293B; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
            `}</style>
        </div>
    );
};

export default Dishes;
