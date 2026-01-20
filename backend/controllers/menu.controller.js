const { Category, MenuItem } = require("../models/menu.model");
const redisClient = require("../redis/redisClient");
const cloudinary = require("../config/cloudinary/cloudinary");
const fs = require('fs');

// Helper to delete temporary file
const deleteTempFile = (path) => {
    setTimeout(() => {
        fs.unlink(path, (err) => {
            if (err) console.error("Error deleting temp file:", err);
            else console.log("Temp file deleted:", path);
        });
    }, 30000); // 30 seconds delay
};

// --- Category Controllers ---

const createCategory = async (req, res) => {
    try {
        // console.log("createCategory req.body:", req.body);
        // console.log("createCategory req.file:", req.file);
        const { name, description } = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) return res.status(400).json({ success: false, message: "Category already exists" });

        let image = "";

        if (req.file) {
            const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                folder: "pos_menu_categories"
            });
            image = uploadResponse.secure_url;
            deleteTempFile(req.file.path);
        } else if (req.body.image && typeof req.body.image === 'string') {
            const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
                folder: "pos_menu_categories"
            });
            image = uploadResponse.secure_url;
        }

        const category = new Category({ name, description, image });
        const savedCategory = await category.save();

        // Invalidate cache
        redisClient.delByPattern('cache:/api/menu/category*');

        res.status(201).json({ success: true, category: savedCategory });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const totalCategories = await Category.countDocuments();
        const categories = await Category.find()
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            categories,
            pagination: {
                totalCategories,
                totalPages: Math.ceil(totalCategories / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: "Category not found" });
        res.status(200).json({ success: true, category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;
        let updateData = { name, description, status };

        if (req.file) {
            const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                folder: "pos_menu_categories"
            });
            updateData.image = uploadResponse.secure_url;
            deleteTempFile(req.file.path);
        } else if (req.body.image && typeof req.body.image === 'string') {
            const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
                folder: "pos_menu_categories"
            });
            updateData.image = uploadResponse.secure_url;
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedCategory) return res.status(404).json({ success: false, message: "Category not found" });

        // Invalidate cache
        redisClient.delByPattern('cache:/api/menu/category*');

        res.status(200).json({ success: true, message: "Category updated", category: updatedCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        // Optional: Check if items exist in this category before deleting
        const items = await MenuItem.find({ category: id });
        if (items.length > 0) {
            return res.status(400).json({ success: false, message: "Cannot delete category with associated items. Please delete or reassign items first." });
        }

        const category = await Category.findByIdAndDelete(id);
        if (!category) return res.status(404).json({ success: false, message: "Category not found" });

        // Invalidate cache
        redisClient.delByPattern('cache:/api/menu/category*');

        res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Menu Item Controllers ---

const createMenuItem = async (req, res) => {
    try {
        console.log("createMenuItem req.body:", req.body);
        console.log("createMenuItem req.file:", req.file);
        let { name, description, price, category, isAvailable, isVeg, spiceLevel, preparationTime, variants, taxes } = req.body;

        // Parse variants if sent as string (Multipart/Form-Data)
        if (typeof variants === 'string') {
            try {
                variants = JSON.parse(variants);
            } catch (e) {
                console.error("Error parsing variants JSON:", e);
                return res.status(400).json({ success: false, message: "Invalid variants format" });
            }
        }

        const existingItem = await MenuItem.findOne({ name });
        if (existingItem) return res.status(400).json({ success: false, message: "Item already exists" });


        let image = "";
        if (req.file) {
            const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                folder: "pos_menu_items"
            });
            image = uploadResponse.secure_url;
            deleteTempFile(req.file.path);
        } else if (req.body.image && typeof req.body.image === 'string') {
            const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
                folder: "pos_menu_items"
            });
            image = uploadResponse.secure_url;
        }

        const menuItem = new MenuItem({
            name, description, price, category, image, isAvailable, isVeg, spiceLevel, preparationTime, variants, taxes
        });
        const savedItem = await menuItem.save();

        // Invalidate cache
        redisClient.delByPattern('cache:/api/menu/item*');

        res.status(201).json({ success: true, menuItem: savedItem });
    } catch (error) {
        console.error("Error creating menu item:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllMenuItems = async (req, res) => {
    try {
        const { category, page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        let query = {};
        if (category) {
            query.category = category;
        }

        const totalItems = await MenuItem.countDocuments(query);
        const menuItems = await MenuItem.find(query)
            .populate('category', 'name')
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            menuItems,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMenuItemById = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id).populate('category', 'name');
        if (!menuItem) return res.status(404).json({ success: false, message: "Menu item not found" });
        res.status(200).json({ success: true, menuItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        if (updateData.variants && typeof updateData.variants === 'string') {
            try {
                updateData.variants = JSON.parse(updateData.variants);
            } catch (error) {
                return res.status(400).json({ success: false, message: "Invalid variants format" });
            }
        }

        if (req.file) {
            const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                folder: "pos_menu_items"
            });
            updateData.image = uploadResponse.secure_url;
            deleteTempFile(req.file.path);
        } else if (req.body.image && typeof req.body.image === 'string') {
            const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
                folder: "pos_menu_items"
            });
            updateData.image = uploadResponse.secure_url;
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedItem) return res.status(404).json({ success: false, message: "Menu item not found" });

        // Invalidate cache
        redisClient.delByPattern('cache:/api/menu/item*');

        res.status(200).json({ success: true, message: "Menu item updated", menuItem: updatedItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const id = req.params.id;
        const menuItem = await MenuItem.findByIdAndDelete(id);
        if (!menuItem) return res.status(404).json({ success: false, message: "Menu item not found" });

        // Invalidate cache
        redisClient.delByPattern('cache:/api/menu/item*');

        res.status(200).json({ success: true, message: "Menu item deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory,
    createMenuItem, getAllMenuItems, getMenuItemById, updateMenuItem, deleteMenuItem
};
