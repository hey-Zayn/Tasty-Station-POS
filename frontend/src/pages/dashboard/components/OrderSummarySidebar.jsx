import React from 'react';
import {
    X,
    Printer,
    CheckCircle2,
    XCircle,
    Phone,
    User,
    Clock,
    Wallet,
    ShoppingBag,
    UtensilsCrossed,
    CreditCard,
    DollarSign,
    QrCode,
    Smartphone
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';


const OrderSummarySidebar = ({ order, onClose, onUpdateStatus }) => {
    if (!order) return (
        <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full text-gray-400">
                <ShoppingBag size={48} />
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Terminal Waiting</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Select a live ticket to<br />access order operations</p>
            </div>
        </div>
    );

    const statusProgress = {
        Pending: 25,
        Preparing: 50,
        Ready: 75,
        Completed: 100,
        Cancelled: 0
    };

    const currentStatus = order.status || "Pending";
    const subtotal = order.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
    const tax = subtotal * 0.1; // 10% example
    const total = subtotal + tax;

    const getStatusAction = () => {
        switch (currentStatus) {
            case "Pending":
                return { label: "Start Preparing", next: "Preparing", color: "bg-orange-500 hover:bg-orange-600" };
            case "Preparing":
                return { label: "Mark as Ready", next: "Ready", color: "bg-cyan-500 hover:bg-cyan-600" };
            case "Ready":
                return { label: "Complete Order", next: "Completed", color: "bg-emerald-500 hover:bg-emerald-600" };
            default:
                return null;
        }
    };

    const action = getStatusAction();

    return (
        <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className="h-full flex flex-col bg-white dark:bg-[#16191C] rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] border border-white/20 dark:border-gray-800 overflow-hidden relative"
        >
            {/* Header */}
            <div className="p-8 pb-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Orders ID</p>
                        <h2 className="text-3xl font-[1000] tracking-tighter text-gray-900 dark:text-white">
                            #{String(order.orderId || '').split('-').pop()?.slice(-6) || 'N/A'}
                        </h2>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Table</p>
                        <h2 className="text-3xl font-[1000] tracking-tighter text-teal-600">
                            {typeof order.table === 'object' ? order.table?.name : (order.table || 'T1')}
                        </h2>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span>Progress</span>
                        <span className="text-teal-600">{currentStatus}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${statusProgress[currentStatus]}%` }}
                            className={cn(
                                "h-full transition-all duration-500",
                                currentStatus === 'Pending' && "bg-amber-500",
                                currentStatus === 'Preparing' && "bg-orange-500",
                                currentStatus === 'Ready' && "bg-cyan-500",
                                currentStatus === 'Completed' && "bg-emerald-500",
                                currentStatus === 'Cancelled' && "bg-rose-500"
                            )}
                        />
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-6 right-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <X size={20} />
                </Button>
            </div>

            {/* Content Scroll Area */}
            <div className="grow overflow-y-auto px-8 py-2 space-y-8 custom-scrollbar">
                {/* Items List */}
                <div className="space-y-6">
                    {order.items?.map((item, i) => (
                        <div key={i} className="flex gap-4 group">
                            <div className="relative shrink-0">
                                <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/10 flex items-center justify-center overflow-hidden border border-orange-100/50">
                                    {/* Placeholder for dish image */}
                                    <UtensilsCrossed size={24} className="text-orange-500/50" />
                                </div>
                            </div>
                            <div className="grow space-y-1 py-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-base font-extrabold text-gray-900 dark:text-white leading-tight capitalize">
                                        {item.name}
                                    </p>
                                    <p className="text-base font-black text-gray-900 dark:text-white ml-4">
                                        Rs {(item.price * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                                <p className="text-xs font-bold text-gray-400">
                                    Note : {item.note || 'Regular'}
                                </p>
                                <div className="flex items-center gap-2 pt-1">
                                    <span className="text-xs font-black text-teal-600">Rs {item.price?.toLocaleString()}</span>
                                    <span className="text-[10px] font-bold text-gray-300">x</span>
                                    <span className="text-xs font-black text-gray-500">{item.quantity}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator className="bg-gray-100/50 dark:bg-gray-800/50" />

                {/* Sub-Summary */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Items({order.items?.length})</span>
                        <span className="text-base font-black text-gray-900 dark:text-white">Rs {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Tax (10%)</span>
                        <span className="text-base font-black text-gray-900 dark:text-white">Rs {tax.toLocaleString()}</span>
                    </div>
                    <div className="border-t-2 border-dashed border-gray-100 dark:border-gray-800 pt-6 flex justify-between items-center">
                        <span className="text-base font-bold text-gray-400 uppercase tracking-widest">Total</span>
                        <span className="text-4xl font-[1000] text-gray-900 dark:text-white tracking-tighter">
                            Rs {total.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Payment Methods</p>
                    {/* ... (keep payment methods logic) */}
                </div>
            </div>

            {/* Actions Footer */}
            <div className="p-8 pt-4">
                <Button
                    onClick={() => action && onUpdateStatus(order._id, action.next)}
                    disabled={!action}
                    className={cn(
                        "w-full h-16 rounded-[1.5rem] font-[1000] text-lg uppercase tracking-widest shadow-2xl transition-all active:scale-[0.98]",
                        action ? action.color : "bg-emerald-500 text-white shadow-emerald-500/40"
                    )}
                >
                    {action ? action.label : 'Order Completed'}
                </Button>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button
                        variant="ghost"
                        className="h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-rose-600"
                        onClick={() => onUpdateStatus(order._id, 'Cancelled')}
                        disabled={order.status === 'Cancelled'}
                    >
                        <XCircle size={16} className="mr-2" />
                        Cancel Order
                    </Button>
                    <Button variant="ghost" className="h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-teal-600">
                        <Printer size={16} className="mr-2" />
                        Print Order
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderSummarySidebar;
