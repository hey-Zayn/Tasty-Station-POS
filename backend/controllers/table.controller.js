const Table = require("../models/table.model");

const createTable = async (req, res) => {
    try {
        const { name, zone, capacity } = req.body;
        const existingTable = await Table.findOne({ name });
        if (existingTable) {
            return res.status(400).json({ success: false, message: "Table already exists" });
        }
        const table = await Table.create({ name, zone, capacity });
        res.status(201).json({ success: true, message: "Table created", table });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTables = async (req, res) => {
    try {
        const tables = await Table.find();
        res.status(200).json({ success: true, tables });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const table = await Table.findByIdAndUpdate(id, req.body, { new: true });
        if (!table) return res.status(404).json({ success: false, message: "Table not found" });
        res.status(200).json({ success: true, message: "Table updated", table });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;
        const table = await Table.findByIdAndDelete(id);
        if (!table) return res.status(404).json({ success: false, message: "Table not found" });
        res.status(200).json({ success: true, message: "Table deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createTable, getTables, updateTable, deleteTable };
