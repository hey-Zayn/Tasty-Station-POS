const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Table name is required"],
        unique: true,
        trim: true
    },
    zone: {
        type: String,
        default: "Indoor",
        trim: true
    },
    capacity: {
        type: Number,
        required: [true, "Capacity is required"],
        min: 1
    },
    status: {
        type: String,
        enum: ["Available", "Occupied", "Reserved"],
        default: "Available"
    },
    currentOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        default: null
    }
}, { timestamps: true });

const Table = mongoose.model("Table", tableSchema);
module.exports = Table;
