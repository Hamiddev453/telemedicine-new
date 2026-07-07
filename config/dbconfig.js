const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        console.log("ENV MONGO_URI:", process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log("MongoDB connected successfully!");

    } catch (err) {
        console.log("Error during MongoDB connection:", err.message);
        process.exit(1);
    }
};

// MongoDB Events
mongoose.connection.on("connected", () => {
    console.log("MongoDB event: connected");
});

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB event: disconnected");
});

mongoose.connection.on("error", (err) => {
    console.log("MongoDB event error:", err.message);
});

module.exports = connectDb;
