const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database/connection");
const userRouter = require("./routers/user.router");

const app = express();
const PORT = process.env.PORT || 8686;


app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
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