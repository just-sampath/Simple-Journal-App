// All Necessary Imports
const express = require("express");

// App Initialization
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static('./public'));

// Importing Routers
const userRouter = require("./routes/userRoutes");
const entryRouter = require("./routes/entryRoutes");
//const { protect } = require("./controllers/authController");

// Defining the routes
app.use("/", userRouter);
app.use("/entries", entryRouter);

// Defining a global server error handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === "production")
    res.status(500).send("<h1>Server Error</h1>");
  else
    res.status(501).json({
      status: "Error Occurred!",
      error: err.message,
    });
});

module.exports = app;
