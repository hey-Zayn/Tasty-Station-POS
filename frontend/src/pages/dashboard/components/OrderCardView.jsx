import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Timer,
    ShoppingBag,
    UtensilsCrossed,
    User,
    CreditCard,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';

const OrderCardView = ({ orders, selectedOrderId, onSelectOrder }) => {
    // Status configuration
    const statusConfig = {
        Pending: {
            icon: Clock,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50 dark:bg-amber-950/20',
            badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
        },
        Completed: {
            icon: CheckCircle2,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
            badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
        },
        Cancelled: {
            icon: XCircle,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50 dark:bg-rose-950/20',
            badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
        }
    };

    // Order type configuration
    const typeConfig = {
        Takeaway: {
            icon: ShoppingBag,
            label: 'Takeaway',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-950/20'
        },
        DineIn: {
            icon: UtensilsCrossed,
            label: 'Dine In',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-950/20'
        },
        Delivery: {
            icon: ShoppingBag,
            label: 'Delivery',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-950/20'
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
                {orders.map((order) => {
                    const statusKey = typeof order.status === 'object' ? order.status?.name : (order.status || 'Pending');
                    const typeKey = typeof order.type === 'object' ? order.type?.name : (order.type || 'DineIn');

                    const isSelected = selectedOrderId === order._id;
                    const status = statusConfig[statusKey] || statusConfig.Pending;
                    const orderType = typeConfig[typeKey] || typeConfig.DineIn;
                    const StatusIcon = status.icon;
                    const TypeIcon = orderType.icon;

                    return (
                        <motion.div
                            key={order._id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.15 }}
                            onClick={() => onSelectOrder(order)}
                            className="h-full"
                        >
                            <Card className={cn(
                                "h-full cursor-pointer transition-all duration-200 border hover:shadow-md hover:border-primary/20",
                                isSelected && "ring-2 ring-primary border-primary shadow-lg"
                            )}>
                                <CardHeader className="pb-3">
                                    {/* Header Row */}
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "p-2 rounded-lg",
                                                    orderType.bgColor
                                                )}>
                                                    <TypeIcon className={cn("h-4 w-4", orderType.color)} />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base font-semibold">
                                                        Order #{String(order.orderId || '').split('-').pop()?.slice(-4) || '0000'}
                                                    </CardTitle>
                                                    <CardDescription className="text-xs">
                                                        {format(new Date(order.createdAt), 'PPpp')}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </div>

                                        <Badge variant="secondary" className={cn(
                                            "font-medium text-xs",
                                            status.badge
                                        )}>
                                            <StatusIcon className="h-3 w-3 mr-1" />
                                            {typeof order.status === 'object' ? order.status?.name : order.status}
                                        </Badge>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="p-1.5 rounded-md bg-muted">
                                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {order.clientName || 'Guest Customer'}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {order.clientPhone || 'No phone provided'}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    {/* Order Details */}
                                    <div className="space-y-3">
                                        {/* Table/Items Info */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {order.table && (
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground">Table</p>
                                                    <p className="text-sm font-medium">{typeof order.table === 'object' ? order.table?.name : order.table}</p>
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground">Items</p>
                                                <p className="text-sm font-medium">{order.items?.length || 0} items</p>
                                            </div>
                                        </div>

                                        {/* Payment Info */}
                                        <div className="flex items-center justify-between pt-3 border-t">
                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                <CreditCard className="h-3.5 w-3.5" />
                                                <span className="capitalize">{typeof order.paymentMethod === 'object' ? order.paymentMethod?.name : (order.paymentMethod || 'Cash')}</span>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">Total</p>
                                                <p className="text-lg font-bold text-primary">
                                                    ${order.totalAmount?.toFixed(2) || '0.00'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Time and Action */}
                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Timer className="h-3.5 w-3.5" />
                                                <span>
                                                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>

                                            <div className={cn(
                                                "flex items-center gap-1 text-xs transition-colors",
                                                isSelected ? "text-primary" : "text-muted-foreground"
                                            )}>
                                                <span>View details</span>
                                                <ChevronRight className="h-3.5 w-3.5" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default OrderCardView;