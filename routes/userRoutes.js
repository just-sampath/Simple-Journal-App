// Required Imports
const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

// Router Initialization
const router = express.Router();

// Definging Entry Routes
router
  .post("/register", authController.register)
  .post("/login", authController.login)
  .post("/update", authController.protect, userController.userUpdate)
  .get("/delete", authController.protect, userController.userDelete);
//.get("/logout", authController.logout);

module.exports = router;
