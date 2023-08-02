// All Necessary Imports
const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const path = require("path");
const cookieParser = require("cookie-parser");

// App Initialization
const app = express();

// For Secutiry Purposes
app.use(helmet());

// For Data from HTML
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// For Static data
app.use(express.static("./public"));

// For views
app.set("view engine", "pug");
app.set("views", path.join(__dirname + "/views"));

// For Data Sanitization
app.use(mongoSanitize());
app.use(xss());

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
  else return res.status(400).render("error", { err });
});

module.exports = app;
