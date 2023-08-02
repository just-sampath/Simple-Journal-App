// Required Imports
const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

// Router Initialization
const router = express.Router();

// Definging GET Routes
router
  .get("/register", userController.register)
  .get(["/", "/login"], userController.login)
  .get("/delete", authController.protect, userController.getUserDelete)
  .get(
    "/changePassword",
    authController.protect,
    userController.getchangePassword
  )
  .get("/forgotPassword", userController.forgotPassword)
  .get("/update", authController.protect, userController.getuserUpdate)
  .get("/me", authController.protect, userController.getMe)
  .get("/resetPassword/:token", authController.resetPassword)
  .get("/logout", authController.logout);

// Defining POST Routes
router
  .post("/register", authController.register)
  .post("/login", authController.login)
  .post("/update", authController.protect, userController.userUpdate)
  .post("/forgotPassword", authController.forgotPassword)
  .post(
    "/changePassword",
    authController.protect,
    userController.changePassword
  )
  .post("/delete", authController.protect, userController.userDelete);

// Exporting the router
module.exports = router;
