const User = require("../models/user.model");
const { validationResult } = require("express-validator");
const genrateToken = require("../utils/genrateToken");

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: errors.array()
            });
        }

        const EmailExist = await User.findOne({ email });
        if (EmailExist) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const user = await User.create({ name, email, password, role });
        genrateToken(user._id, res);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
        console.log(error)
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        genrateToken(user._id, res);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
        console.log(error)
    }
};


module.exports = { register, login };