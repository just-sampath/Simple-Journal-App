// Required Imports
const express = require("express");
const entryController = require("../controllers/entryController");
const authController = require("../controllers/authController");

// Defining the router
const router = express.Router();

// Defining the routes
router
  .get("/", authController.protect, entryController.getAllEntries)
  .get("/:title", authController.protect, entryController.getEntry)
  .post("/create", authController.protect, entryController.createEntry)
  .patch("/update/:title", authController.protect, entryController.updateEntry)
  .delete("/delete/:title", authController.protect, entryController.deleteEntry)
  .get("/deleteAll", authController.protect, entryController.deleteAllEntries);

// Exporting the router
module.exports = router;
