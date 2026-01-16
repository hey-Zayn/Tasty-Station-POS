const { Category, MenuItem } = require("../models/menu.model");
const cloudinary = require("../config/cloudinary/cloudinary");

// --- Category Controllers ---

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) return res.status(400).json({ success: false, message: "Category already exists" });

        let image = "";

        if (req.file) {
            const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                folder: "pos_menu_categories"
            });
            image = uploadResponse.secure_url;
        } else if (req.body.image && typeof req.body.image === 'string') {
            const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
                folder: "pos_menu_categories"
            });
            image = uploadResponse.secure_url;
        }

        const newCategory = await Category.create({ name, description, image });
        res.status(201).json({ success: true, message: "Category created", category: newCategory });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, categories });
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
        const { name, description, status } = req.body;
        let updateData = { name, description, status };

        if (req.file) {
            const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                folder: "pos_menu_categories"
            });
            updateData.image = uploadResponse.secure_url;
        } else if (req.body.image && typeof req.body.image === 'string') {
            const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
                folder: "pos_menu_categories"
            });
            updateData.image = uploadResponse.secure_url;
        }

        const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!category) return res.status(404).json({ success: false, message: "Category not found" });
        res.status(200).json({ success: true, message: "Category updated", category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        // Optional: Check if items exist in this category before deleting
        const items = await MenuItem.find({ category: categoryId });
        if (items.length > 0) {
            return res.status(400).json({ success: false, message: "Cannot delete category with associated items. Please delete or reassign items first." });
        }

        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) return res.status(404).json({ success: false, message: "Category not found" });
        res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Menu Item Controllers ---

const createMenuItem = async (req, res) => {
    try {
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
        } else if (req.body.image && typeof req.body.image === 'string') {
            const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
                folder: "pos_menu_items"
            });
            image = uploadResponse.secure_url;
        }

        const menuItem = await MenuItem.create({
            name, description, price, category, image, isAvailable, isVeg, spiceLevel, preparationTime, variants, taxes
        });
        res.status(201).json({ success: true, message: "Menu item created", menuItem });
    } catch (error) {
        console.error("Error creating menu item:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllMenuItems = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category) {
            query.category = category;
        }
        const menuItems = await MenuItem.find(query).populate('category', 'name');
        res.status(200).json({ success: true, menuItems });
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
        } else if (req.body.image && typeof req.body.image === 'string') {
            const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
                folder: "pos_menu_items"
            });
            updateData.image = uploadResponse.secure_url;
        }

        const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!menuItem) return res.status(404).json({ success: false, message: "Menu item not found" });
        res.status(200).json({ success: true, message: "Menu item updated", menuItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!menuItem) return res.status(404).json({ success: false, message: "Menu item not found" });
        res.status(200).json({ success: true, message: "Menu item deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory,
    createMenuItem, getAllMenuItems, getMenuItemById, updateMenuItem, deleteMenuItem
};
