import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import KitchenOrderCard from './KitchenOrderCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { cn } from "@/lib/utils";

const KitchenColumn = ({ title, icon: Icon, orders, onUpdate, nextStatus, actionLabel, actionIcon }) => {
    return (
        <div className="flex flex-col gap-6 p-6 rounded-[2rem] bg-gray-50/50 dark:bg-black/10 border border-gray-100 dark:border-gray-800/50 min-h-[75vh]">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <Icon className="size-4 text-teal-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{title}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">
                            {orders.length} Active Tickets
                        </p>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 pr-4 -mr-4 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    <motion.div layout className="space-y-4 pb-4">
                        {orders.map((order) => (
                            <motion.div
                                key={order._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <KitchenOrderCard
                                    order={order}
                                    onUpdate={onUpdate}
                                    nextStatus={nextStatus}
                                    actionLabel={actionLabel}
                                    actionIcon={actionIcon}
                                />
                            </motion.div>
                        ))}
                        {orders.length === 0 && (
                            <div className="h-48 flex flex-col items-center justify-center text-gray-300 dark:text-gray-700 border-2 border-dashed border-gray-100 dark:border-gray-800/50 rounded-3xl mt-4">
                                <Search className="size-8 opacity-20 mb-3" />
                                <p className="text-xs font-bold uppercase tracking-widest opacity-40">Station Clear</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </ScrollArea>
        </div>
    );
};

export default KitchenColumn;
