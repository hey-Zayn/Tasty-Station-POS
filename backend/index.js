const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database/connection");
const userRouter = require("./routers/user.router");

const app = express();
const PORT = process.env.PORT || 8686;


app.use(express.json());
const allowedOrigins = ["http://localhost:5173", "https://tastystation.vercel.app"];

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.use(cookieParser());

connectDB();

app.use('/api/users', userRouter);


app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the POS API"
    })
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});