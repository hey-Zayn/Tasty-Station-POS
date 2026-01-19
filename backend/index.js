const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");




const connectDB = require("./config/database/connection");
const userRouter = require("./routers/user.router");
const menuRouter = require("./routers/menu.router");
const tableRouter = require("./routers/table.router");
const taxRouter = require("./routers/tax.router");
const discountRouter = require("./routers/discount.router");
const orderRouter = require("./routers/order.router");
const inventoryRouter = require("./routers/inventory.router");
const reportRouter = require("./routers/report.router");
const clientRouter = require("./routers/client.router");
const dashboardRouter = require("./routers/dashboard.router");
const redisTestRouter = require("./routers/redis.test.router");


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
const allowedOrigins = [
    "http://localhost:5173",
    "https://tastystation.vercel.app",
    "tastystation.vercel.app",
    "https://www.tastystation.vercel.app",
    "www.tastystation.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enable pre-flight requests for all routes
app.options(/.*/, cors());
app.use(cookieParser());

app.use('/api/users', userRouter);
app.use('/api/menu', menuRouter);
app.use('/api/table', tableRouter);
app.use('/api/tax', taxRouter);
app.use('/api/discount', discountRouter);
app.use('/api/orders', orderRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/reports', reportRouter);
app.use('/api/clients', clientRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api', redisTestRouter);


connectDB();



app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the POS API"
    })
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});