const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/database/connection");
const Table = require("./models/table.model");

dotenv.config();

const seedTables = async () => {
    try {
        await connectDB();

        // Clear existing tables
        await Table.deleteMany({});
        console.log("Existing tables cleared.");

        const tableData = [
            // Indoor (Main Dining)
            { name: "Table 1", zone: "Indoor", capacity: 6, status: "Available" },
            { name: "Table 2", zone: "Indoor", capacity: 2, status: "Occupied" }, // Red
            { name: "Table 3", zone: "Indoor", capacity: 2, status: "Available" },
            { name: "Table 4", zone: "Indoor", capacity: 8, status: "Reserved" }, // Amber
            { name: "Table 5", zone: "Indoor", capacity: 4, status: "Available" },
            { name: "Table 6", zone: "Indoor", capacity: 10, status: "Available" },

            // Terrace
            { name: "T-1", zone: "Terrace", capacity: 4, status: "Available" },
            { name: "T-2", zone: "Terrace", capacity: 4, status: "Occupied" },
            { name: "T-3", zone: "Terrace", capacity: 2, status: "Available" },
            { name: "T-4", zone: "Terrace", capacity: 6, status: "Available" },

            // Outdoor
            { name: "O-1", zone: "Outdoor", capacity: 8, status: "Available" },
            { name: "O-2", zone: "Outdoor", capacity: 12, status: "Reserved" }, // Large party
            { name: "O-3", zone: "Outdoor", capacity: 2, status: "Available" },
        ];

        await Table.insertMany(tableData);
        console.log("Dummy tables inserted successfully!");

        process.exit();
    } catch (error) {
        console.error("Error seeding tables:", error);
        process.exit(1);
    }
};

seedTables();
