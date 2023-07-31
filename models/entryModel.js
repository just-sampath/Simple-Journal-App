// Required Imports
const mongoose = require("mongoose");

// Entry Schema
const entrySchema = new mongoose.Schema({
  title: {
    type: "String",
    default: Date().toString(),
  },
  data: {
    type: "String",
    required: [true, "Please provide some data!"],
  },
});

// Creating the Entry Model
const Entry = mongoose.model("Entries", entrySchema);

// Exporting the Entry Model
module.exports = Entry;
