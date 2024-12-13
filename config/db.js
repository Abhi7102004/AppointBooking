const mongoose = require("mongoose");
const mongoUrl = process.env.MONGODB_URL;
const db = mongoose
  .connect(mongoUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

module.exports=db