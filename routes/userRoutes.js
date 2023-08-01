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
  .get("/delete", authController.protect, userController.userDelete)
  .get(
    "/changePassword",
    authController.protect,
    userController.getchangePassword
  )
  .get("/forgotPassword", userController.forgotPassword)
  .get("/update", authController.protect, userController.getuserUpdate)
  .get("/me", authController.protect, userController.getMe);


// Defining POST Routes
router
  .post("/register", authController.register)
  .post("/login", authController.login)
  .post("/update", authController.protect, userController.userUpdate)
  .post("/forgotPassword", authController.forgotPassword)
  .post("/resetPassword/:token", authController.resetPassword)
  .post(
    "/changePassword",
    authController.protect,
    userController.changePassword
  );

module.exports = router;
