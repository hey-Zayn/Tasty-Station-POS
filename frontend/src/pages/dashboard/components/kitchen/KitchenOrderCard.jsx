import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, User, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

const KitchenOrderCard = ({ order, onUpdate, nextStatus, actionLabel, actionIcon: ActionIcon }) => {
    return (
        <Card className="group overflow-hidden border-gray-100 dark:border-gray-800 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-300 shadow-sm hover:shadow-md rounded-2xl bg-white dark:bg-[#1A1C1E]">
            <CardHeader className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                order.type === 'Dine-in' ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30" : "bg-blue-50 text-blue-600 dark:bg-blue-950/30"
                            )}>
                                {order.type}
                            </span>
                            <Badge variant="outline" className="font-bold text-[10px] h-5 border-gray-100 dark:border-gray-800 px-1.5 flex items-center gap-1">
                                <Clock className="size-2.5" />
                                {format(new Date(order.createdAt), 'HH:mm')}
                            </Badge>
                        </div>
                        <CardTitle className="text-lg font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="text-gray-400 text-sm font-medium">#</span>
                            {order.orderId?.split('-').pop().slice(-4) || order.orderId}
                        </CardTitle>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-lg">
                        <Hash className="size-3 text-teal-500" />
                        <span>{order.table?.name || "Counter"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-lg">
                        <User className="size-3 text-teal-500" />
                        <span className="truncate max-w-[100px]">{order.clientName}</span>
                    </div>
                </div>
            </CardHeader>

            <Separator className="bg-gray-50 dark:bg-gray-800" />

            <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-0.5">
                            <div className="flex items-center gap-3">
                                <div className="size-6 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-[10px] flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                    {item.quantity}
                                </div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-tight capitalize">
                                    {item.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-2">
                    <Button
                        onClick={() => onUpdate(order._id, nextStatus)}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold uppercase tracking-widest text-[10px] h-11 rounded-xl shadow-lg shadow-teal-600/10 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <ActionIcon className="size-3.5" />
                        {actionLabel}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default KitchenOrderCard;
