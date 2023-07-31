// Required Imports
const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// dotenv Configuration
dotenv.config({ path: "./config.env" });

// MongoDB Connection
mongoose
  .connect(process.env.DATABASE.replace("<password>", process.env.DB_PASS))
  .then(console.log("DB Connection Successful!"))
  .catch(console.log);

// Listening to the Server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
