const Order = require("../models/order.model");
const { MenuItem } = require("../models/menu.model");
const Client = require("../models/client.model");

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { type, paymentMethod, items, clientId, tableId, clientName, clientPhone } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Order must contain at least one item." });
        }

        // 1. Find or Create Client
        let client;
        if (clientId) {
            client = await Client.findById(clientId);
        } else if (clientPhone) {
            client = await Client.findOne({ phone: clientPhone });
            if (!client) {
                if (!clientName) {
                    return res.status(400).json({ success: false, message: "Client name is required for new customers." });
                }
                client = await Client.create({
                    name: clientName,
                    phone: clientPhone,
                    totalSpent: 0,
                    orders: [],
                    lastVisit: new Date()
                });
            }
        } else {
            return res.status(400).json({ success: false, message: "Client phone number is required." });
        }

        if (!client) {
            return res.status(404).json({ success: false, message: "Client not found or could not be created." });
        }

        const finalClientId = client._id;


        // 2. Calculate total and validate items
        let totalAmount = 0;
        const validItems = [];

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem) {
                return res.status(404).json({ success: false, message: `Menu item not found: ${item.menuItem}` });
            }

            // Use current price from DB, not from frontend
            const price = menuItem.price;
            const itemTotal = price * item.quantity;
            totalAmount += itemTotal;

            validItems.push({
                menuItem: menuItem._id,
                name: menuItem.name,
                price: price,
                quantity: item.quantity
            });
        }

        // 3. Generate unique Order ID
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // 4. Create Order
        const newOrder = new Order({
            orderId,
            type,
            paymentMethod: paymentMethod || "Cash",
            items: validItems,
            totalAmount,
            client: finalClientId,
            clientName: client.name,
            clientPhone: client.phone,
            user: req.user._id, // Assumes auth middleware populates req.user
            table: tableId || null
        });

        await newOrder.save();

        // 5. Update Client History
        await Client.findByIdAndUpdate(finalClientId, {
            $push: { orders: newOrder._id },
            $inc: { totalSpent: totalAmount },
            $set: { lastVisit: new Date() }
        });

        // 6. Populate and return for billing slip
        const populatedOrder = await Order.findById(newOrder._id)
            .populate("client", "name email phone address")
            .populate("user", "name")
            .populate("table", "name zone");

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: populatedOrder
        });

    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const { type, status, date } = req.query;
        let query = {};

        if (type) query.type = type;
        if (status) query.status = status;
        // Simple date filtering (could be improved for ranges)
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.createdAt = { $gte: startDate, $lt: endDate };
        }

        const orders = await Order.find(query)
            .populate("client", "name phone")
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Get Orders Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get order statistics for dashboard
const getOrderStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: "Pending" });

        // Revenue aggregate
        const revenueData = await Order.aggregate([
            { $match: { status: { $ne: "Cancelled" } } },
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Recently placed orders for the table
        const recentOrders = await Order.find()
            .populate("client", "name")
            .populate("table", "name")
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            stats: {
                totalRevenue,
                totalOrders,
                pendingOrders,
                avgOrderValue
            },
            recentOrders
        });
    } catch (error) {
        console.error("Get Order Stats Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get single order for reprint
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("client")
            .populate("user", "name")
            .populate("table", "name");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Get Order Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get orders for kitchen (Pending, Preparing, Ready)
const getKitchenOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            status: { $in: ["Pending", "Preparing", "Ready"] }
        })
            .populate("client", "name")
            .populate("table", "name")
            .populate("user", "name")
            .sort({ createdAt: 1 }); // Oldest first for kitchen

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Get Kitchen Orders Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!["Pending", "Preparing", "Ready", "Completed", "Cancelled"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate("client", "name phone")
            .populate("user", "name")
            .populate("table", "name");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, message: `Order marked as ${status}`, order });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { createOrder, getAllOrders, getOrderById, getOrderStats, updateOrderStatus, getKitchenOrders };
