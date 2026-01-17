import React from 'react';
import { cn } from "@/lib/utils";
import { User, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const TableCard = ({ table, onClick }) => {
    // Status configurations
    const statusConfig = {
        "Available": {
            color: "bg-teal-50 border-teal-200",
            badge: "bg-teal-100 text-teal-700 hover:bg-teal-200",
            shadow: "shadow-sm hover:shadow-md",
            chair: "bg-teal-200 border-teal-300"
        },
        "Occupied": {
            color: "bg-red-50 border-red-200",
            badge: "bg-red-100 text-red-700 hover:bg-red-200",
            shadow: "shadow-sm hover:shadow-md ring-1 ring-red-200",
            chair: "bg-red-200 border-red-300"
        },
        "Reserved": {
            color: "bg-amber-50 border-amber-200",
            badge: "bg-amber-100 text-amber-800 hover:bg-amber-200",
            shadow: "shadow-sm hover:shadow-md ring-1 ring-amber-200",
            chair: "bg-amber-200 border-amber-300"
        }
    };

    const config = statusConfig[table.status] || statusConfig["Available"];

    // Dynamic sizing based on capacity
    const getTableDimensions = (capacity) => {
        // Base size for 2 people
        if (capacity <= 2) return { width: "w-24", height: "h-24", distribution: { top: 1, bottom: 1, left: 0, right: 0 } };
        if (capacity <= 4) return { width: "w-32", height: "h-24", distribution: { top: 2, bottom: 2, left: 0, right: 0 } };
        // Increase width for more people
        if (capacity <= 6) return { width: "w-40", height: "h-28", distribution: { top: 2, bottom: 2, left: 1, right: 1 } };
        if (capacity <= 8) return { width: "w-48", height: "h-28", distribution: { top: 3, bottom: 3, left: 1, right: 1 } };
        if (capacity <= 10) return { width: "w-56", height: "h-32", distribution: { top: 4, bottom: 4, left: 1, right: 1 } };
        // Large table
        return { width: "w-64", height: "h-32", distribution: { top: Math.ceil((capacity - 2) / 2), bottom: Math.ceil((capacity - 2) / 2), left: 1, right: 1 } };
    };

    const dimensions = getTableDimensions(table.capacity);

    const renderChairRow = (count, side) => {
        if (count <= 0) return null;

        const isVertical = side === 'left' || side === 'right';
        // Base chair classes
        const chairBaseClass = cn(
            "absolute flex gap-3 justify-center items-center pointer-events-none",
            isVertical ? "flex-col h-full top-0 py-2" : "flex-row w-full left-0 px-2"
        );

        // Position specific styles
        const positionClass = {
            top: "-top-5 left-0 w-full",
            bottom: "-bottom-5 left-0 w-full",
            left: "-left-5 top-0 h-full",
            right: "-right-5 top-0 h-full"
        };

        // Individual chair style
        const individualChairClass = cn(
            "rounded-md border shadow-sm transition-colors duration-200",
            config.chair,
            isVertical ? "w-4 h-8" : "w-8 h-4",
            // If table is occupied, make some chairs look "active" visually? 
            // For now, keep uniform color based on status.
        );

        return (
            <div className={cn(chairBaseClass, positionClass[side])}>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className={individualChairClass}>
                        {/* Backrest hint for detail */}
                        <div className={cn(
                            "opacity-30 bg-black/10 absolute",
                            isVertical ? "w-1 h-6 top-1 right-0.5 rounded-sm" : "h-1 w-6 bottom-0.5 left-1 rounded-sm"
                        )} />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div
            onClick={() => onClick(table)}
            className="flex flex-col items-center  justify-center p-8 cursor-pointer group hover:scale-[1.02] transition-transform duration-200"
        >
            <div className="relative ">
                {/* Chairs */}
                {renderChairRow(dimensions.distribution.top, 'top')}
                {renderChairRow(dimensions.distribution.bottom, 'bottom')}
                {renderChairRow(dimensions.distribution.left, 'left')}
                {renderChairRow(dimensions.distribution.right, 'right')}

                {/* Table Surface */}
                <div className={cn(
                    "relative rounded-xl border-2   flex flex-col items-center justify-center transition-colors duration-300 z-10",
                    dimensions.width,
                    dimensions.height,
                    config.color,
                    config.shadow
                )}>
                    <span className="font-bold text-gray-700 text-lg mb-0.5">{table.name}</span>
                    <div className="flex items-center text-xs font-medium text-gray-500 bg-white/50 px-1.5 py-0.5 rounded-full">
                        <Users className="w-3 h-3 mr-1" />
                        {table.capacity}
                    </div>

                    {/* Status Indicator Dot */}
                    <div className={cn(
                        "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm",
                        table.status === 'Available' ? "bg-teal-500" :
                            table.status === 'Occupied' ? "bg-red-500" : "bg-amber-500"
                    )} />
                </div>
            </div>

            {/* Hover Info (Optional, keeping it clean for now as per design) */}
        </div>
    );
};

export default TableCard;
