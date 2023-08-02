// Required Imports
const express = require("express");
const entryController = require("../controllers/entryController");
const authController = require("../controllers/authController");

// Defining the router
const router = express.Router();

// Defining the GET routes
router
  .get("/", authController.protect, entryController.getAllEntries)
  .get("/:title", authController.protect, entryController.getEntry)
  .get("/delete/:title", authController.protect, entryController.deleteEntry)
  .get("/deleteAll", authController.protect, entryController.deleteAllEntries);

// Defining the POST routes
router
  .post("/create", authController.protect, entryController.createEntry)
  .post("/update/:title", authController.protect, entryController.updateEntry);

// Exporting the router
module.exports = router;
