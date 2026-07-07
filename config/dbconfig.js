const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        console.log("ENV MONGO_URI:", process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);

        console.log("db connected successfully!");
    } catch (err) {
        console.log("Error during mongodb connection", err);
    }
};

module.exports = connectDb;


