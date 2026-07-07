const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    console.log("ENV MONGOURI:", process.env.MONGOURI);

    await mongoose.connect(process.env.MONGOURI);

    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Error during MongoDB connection:", err.message);
    process.exit(1);
  }
};

module.exports = connectDb;