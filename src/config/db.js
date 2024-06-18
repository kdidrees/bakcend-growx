const mongoose = require("mongoose");

// Connect to the MongoDB server
mongoose
  .connect(
    "mongodb://localhost:27017/growxads",
    {
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });