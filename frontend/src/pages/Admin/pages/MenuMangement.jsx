import React, { useEffect, useState, memo } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Loader2, Utensils } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { useMenuStore } from '@/store/useMenuStore'

const MenuItemCard = memo(({ dish }) => {
    return (
        <Card
            className={cn(
                "relative pt-16 pb-4 px-4 overflow-visible border transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer bg-white dark:bg-teal-900/20 border-gray-100 dark:border-gray-800 hover:border-teal-500 dark:hover:border-teal-500 group"
            )}
        >
            {/* Circular Image - Positioned absolutely at top center */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full shadow-lg overflow-hidden border-4 border-white dark:border-gray-900 group-hover:scale-105 transition-transform duration-300 bg-gray-100">
                {dish.image ? (
                    <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                        <Utensils className="w-10 h-10" />
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center text-center mt-6 space-y-4">
                {/* Details */}
                <div className="space-y-1 w-full">
                    <span className="text-sm text-gray-400 dark:text-gray-400 font-medium tracking-wide uppercase">
                        {dish.category?.name || "Uncategorized"}
                    </span>
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-tight px-1 truncate w-full" title={dish.name}>
                        {dish.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 h-8 px-2">{dish.description}</p>
                </div>

                {/* Price and Controls */}
                <div className="flex items-center justify-between w-full pt-2 px-2">
                    <span className="text-xl font-bold text-teal-700 dark:text-teal-400">
                        ${dish.price.toFixed(2)}
                    </span>

                    <div className="flex items-center gap-3">
                        <button
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={true}
                        >
                            <Minus className="w-4 h-4" />
                        </button>

                        <span className="text-gray-900 dark:text-white font-semibold w-4">
                            0
                        </span>

                        <button
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    );
});

MenuItemCard.displayName = "MenuItemCard";

const MenuMangement = () => {
    const { menu, getAllMenuItems, getAllCategories, isLoading } = useMenuStore();
    const [activeCategory] = useState("All");

    useEffect(() => {
        getAllCategories();
        getAllMenuItems();
    }, [getAllCategories, getAllMenuItems]);

    // Filter menu items based on active category
    const filteredMenu = React.useMemo(() => {
        return activeCategory === "All"
            ? menu
            : menu.filter(item => item.category?._id === activeCategory || item.category?.name === activeCategory);
    }, [menu, activeCategory]);

    return (
        <div className="w-full h-full px-6 py-10 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Menu Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your food menu, categories, and prices</p>
                </div>
                <Link to="/admin/add-menu">
                    <Button className="bg-teal-600 hover:bg-teal-700 rounded-full py-2 px-4 text-white shadow-lg shadow-teal-600/20 transition-all hover:scale-105 active:scale-95">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Menu
                    </Button>
                </Link>
            </div>

            {/* Menu Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-20 mt-12">
                    {filteredMenu.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No menu items found in this category.
                        </div>
                    ) : (
                        filteredMenu.map((dish) => (
                            <MenuItemCard key={dish._id} dish={dish} />
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default MenuMangement;