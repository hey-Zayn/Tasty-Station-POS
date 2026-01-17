const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./config/database/connection");
const { Category, MenuItem } = require("./models/menu.model");

const seedMenu = async () => {
    try {
        await connectDB();

        console.log("Clearing existing menu data...");
        await Category.deleteMany({});
        await MenuItem.deleteMany({});

        console.log("Creating categories...");
        const categories = await Category.insertMany([
            {
                name: "Starters",
                description: "Delicious appetizers to start your meal.",
                image: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80",
                status: "active"
            },
            {
                name: "Main Course",
                description: "Hearty and fulfilling main dishes.",
                image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
                status: "active"
            },
            {
                name: "Burgers",
                description: "Juicy burgers with premium ingredients.",
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
                status: "active"
            },
            {
                name: "Desserts",
                description: "Sweet treats to end your day.",
                image: "https://images.unsplash.com/photo-1563729768-e4362d881989?auto=format&fit=crop&w=800&q=80",
                status: "active"
            },
            {
                name: "Beverages",
                description: "Refreshing drinks and mocktails.",
                image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
                status: "active"
            }
        ]);

        const catMap = {};
        categories.forEach(c => { catMap[c.name] = c._id; });

        console.log("Creating menu items...");
        await MenuItem.insertMany([
            // Starters
            {
                name: "Crispy Calamari",
                description: "Golden fried calamari rings served with tartar sauce.",
                price: 12.99,
                category: catMap["Starters"],
                image: "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=800&q=80",
                isAvailable: true,
                isVeg: false,
                spiceLevel: "mild",
                preparationTime: 15,
                taxes: 5,
                variants: [
                    { name: "Regular", price: 12.99 },
                    { name: "Large", price: 18.99 }
                ]
            },
            {
                name: "Bruschetta",
                description: "Toasted bread topped with tomatoes, basil, and mozzarella.",
                price: 8.50,
                category: catMap["Starters"],
                image: "https://images.unsplash.com/photo-1572695157369-a2123ba196a6?auto=format&fit=crop&w=800&q=80",
                isAvailable: true,
                isVeg: true,
                spiceLevel: "mild",
                preparationTime: 10,
                taxes: 5,
                variants: [{ name: "Standard", price: 8.50 }]
            },

            // Burgers
            {
                name: "Classic Cheeseburger",
                description: "Beef patty, cheddar cheese, lettuce, tomato, and house sauce.",
                price: 14.50,
                category: catMap["Burgers"],
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
                isAvailable: true,
                isVeg: false,
                spiceLevel: "medium",
                preparationTime: 20,
                taxes: 8,
                variants: [
                    { name: "Single Patty", price: 14.50 },
                    { name: "Double Patty", price: 18.50 }
                ]
            },
            {
                name: "Spicy Chicken Burger",
                description: "Crispy chicken fillet with spicy mayo and jalapenos.",
                price: 13.50,
                category: catMap["Burgers"],
                image: "https://images.unsplash.com/photo-1619250916024-5d9c24098492?auto=format&fit=crop&w=800&q=80",
                isAvailable: true,
                isVeg: false,
                spiceLevel: "hot",
                preparationTime: 20,
                taxes: 8,
                variants: [{ name: "Regular", price: 13.50 }]
            },

            // Main Course
            {
                name: "Grilled Salmon",
                description: "Fresh salmon fillet grilled to perfection, served with asparagus.",
                price: 24.99,
                category: catMap["Main Course"],
                image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
                isAvailable: true,
                isVeg: false,
                spiceLevel: "mild",
                preparationTime: 25,
                taxes: 10,
                variants: [{ name: "Standard", price: 24.99 }]
            },
            {
                name: "Vegetable Pasta",
                description: "Penne pasta tossed in creamy alfredo sauce with seasonal vegetables.",
                price: 16.00,
                category: catMap["Main Course"],
                image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80",
                isAvailable: true,
                isVeg: true,
                spiceLevel: "medium",
                preparationTime: 20,
                taxes: 8,
                variants: [{ name: "Regular", price: 16.00 }]
            },

            // Desserts
            {
                name: "Chocolate Lava Cake",
                description: "Warm chocolate cake with a molten center, served with vanilla ice cream.",
                price: 9.99,
                category: catMap["Desserts"],
                image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80",
                isAvailable: true,
                isVeg: true,
                spiceLevel: "mild",
                preparationTime: 15,
                taxes: 5,
                variants: [{ name: "Standard", price: 9.99 }]
            },

            // Beverages
            {
                name: "Mojito",
                description: "Classic mint and lime mocktail.",
                price: 6.50,
                category: catMap["Beverages"],
                image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
                isAvailable: true,
                isVeg: true,
                spiceLevel: "mild",
                preparationTime: 5,
                taxes: 5,
                variants: [{ name: "Glass", price: 6.50 }, { name: "Pitcher", price: 18.00 }]
            }
        ]);

        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedMenu();
