// Required Imports
const mongoose = require("mongoose");
const Users = require("./userModel");

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
  createdOn: { type: Date, default: Date() },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});

entrySchema.path("title").validate(async function (value) {
  const entry = await this.constructor.findOne({
    title: value,
    parent: this.parent,
  });

  // If an entry with the same title and parent exists, return false to trigger the validation error
  return !entry;
}, "Entry with the same title already exists for this parent");

// Creating the Entry Model
const Entry = mongoose.model("Entries", entrySchema);

// Exporting the Entry Model
module.exports = Entry;
