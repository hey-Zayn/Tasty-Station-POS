const { register, login } = require('../controllers/user.controller');
const { body } = require('express-validator');
const protectedRoute = require('../middlewares/auth.middleware');
const router = require('express').Router();

router.post('/register',
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("email").trim().isEmail().withMessage("Invalid email format").normalizeEmail(),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
        body("role").optional().isIn(["admin", "cashier", "client", "kitchen"]).withMessage("Invalid role")
    ],
    register);
router.post('/login',
    [
        body("email").trim().isEmail().withMessage("Invalid email format").normalizeEmail(),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    ],
    login);

router.get('/me', protectedRoute, (req, res) => {
    res.json(req.user);
})

router.post('/logout', (req, res) => {
    res.clearCookie("token");
    res.json({
        success: true,
        message: "User logged out successfully"
    })
})

module.exports = router;
