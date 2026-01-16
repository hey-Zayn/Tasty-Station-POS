import React from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Hamburger, Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

const MenuMangement = () => {
    // Using the provided image for all items as valid placeholder
    const FOOD_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D";

    const dishes = [
        { id: 1, category: "Lunch", name: "Grilled Salmon Steak", price: 15.00, quantity: 0 },
        { id: 2, category: "Salad", name: "Tofu Poke Bowl", price: 7.00, quantity: 0 },
        { id: 3, category: "Pasta", name: "Pasta with Roast Beef", price: 10.00, quantity: 2 },
        { id: 4, category: "Beef", name: "Beef Steak", price: 30.00, quantity: 0 },
        { id: 5, category: "Rice", name: "Shrimp Rice Bowl", price: 6.00, quantity: 2 },
        { id: 6, category: "Dessert", name: "Apple Stuffed Pancake", price: 35.00, quantity: 1 },
        { id: 7, category: "Chicken", name: "Chicken Quinoa & Herbs", price: 12.00, quantity: 0 },
        { id: 8, category: "Salad", name: "Vegetable Shrimp", price: 10.00, quantity: 1 }
    ]

    const Menu = [
        { id: 1, name: "Lunch", dishes: <Hamburger /> },
        { id: 2, name: "Dinner", dishes: <Hamburger /> },
        { id: 3, name: "Dessert", dishes: <Hamburger /> },
    ]

    return (
        <div className="w-full h-[calc(100vh-5rem)] px-6 py-10 ">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Menu Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your food menu, categories, and prices</p>
                </div>
                <Link to="/admin/add-menu">
                    <Button className="bg-teal-600 hover:bg-teal-700 rounded-full py-2 px-4  text-white shadow-lg shadow-teal-600/20 transition-all hover:scale-105 active:scale-95">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Menu
                    </Button>
                </Link>
            </div>

            <div className='flex items-center gap-3 overflow-x-auto py-2 px-6 scrollbar-hide'>
                {Menu.map((menu) => {
                    const isActive = menu.id === 1; // Default active state for demo
                    return (
                        <button
                            key={menu.id}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 rounded-full border transition-all duration-300 font-medium whitespace-nowrap",
                                isActive
                                    ? "bg-transparent text-teal-600 border-teal-600 shadow-md shadow-teal-600/20 transform scale-105"
                                    : "bg-white dark:bg-transparent text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400"
                            )}
                        >
                            <span className="p-1 rounded-full bg-white/20">
                                {menu.dishes}
                            </span>
                            <span>{menu.name}</span>
                        </button>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-20">
                {dishes.map((dish) => {
                    const isActive = dish.quantity > 0;

                    return (
                        <Card
                            key={dish.id}
                            className={cn(
                                "relative pt-16 pb-4 px-4 overflow-visible border transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer mb-8 bg-white dark:bg-teal-900/20",
                                isActive ? "border-teal-500 ring-1 ring-teal-500" : "border-gray-100"
                            )}
                        >
                            {/* Circular Image - Positioned absolutely at top center */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full shadow-lg overflow-hidden border-4 border-white">
                                <img
                                    src={FOOD_IMAGE}
                                    alt={dish.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex flex-col items-center text-center mt-6 space-y-4">
                                {/* Details */}
                                <div className="space-y-1">
                                    <span className="text-sm text-gray-400 dark:text-gray-200 font-medium tracking-wide">
                                        {dish.category}
                                    </span>
                                    <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-tight px-2">
                                        {dish.name.slice(0, 18)}
                                    </h3>
                                </div>

                                {/* Price and Controls */}
                                <div className="flex items-center justify-between w-full pt-2 px-2">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        ${dish.price.toFixed(2)}
                                    </span>

                                    <div className="flex items-center gap-3">
                                        <button
                                            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => { }}
                                            disabled={dish.quantity === 0}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>

                                        <span className="text-gray-900 dark:text-white font-semibold w-4">
                                            {dish.quantity}
                                        </span>

                                        <button
                                            className="w-8 h-8 rounded-full flex items-center justify-center bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-sm"
                                            onClick={() => { }}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

export default MenuMangement