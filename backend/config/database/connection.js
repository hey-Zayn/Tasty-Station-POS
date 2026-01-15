const mongoose = require("mongoose");


const connectDB = async () => {

    await mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("MongoDB connected");
    }).catch((error) => {
        console.log(error);
        console.log(`Database connection Error`);
        process.exit(1);
    })

}


module.exports = connectDB;