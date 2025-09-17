const mongoose = require("mongoose");

function connectDB() {
  mongoose.set("strictQuery", false);
  
  const mongoUri = process.env.DB_LINK;
  
  if (!mongoUri) {
    console.error("MongoDB connection string not found in environment variables");
    return;
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
  };

  mongoose
    .connect(mongoUri, options)
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
      if (process.env.NODE_ENV !== "production") {
        process.exit(1);
      }
    });
}

module.exports = connectDB;