// Required Imports
const entryModel = require("../models/entryModel");
const userModel = require("../models/userModel");

// Getting all Entries
exports.getAllEntries = async (id, req, res, next) => {
  try {
    // Getting all entries
    const entries = await entryModel.find({ parent: id });

    // Sending the response
    /*res.status(200).json({
      status: "Success",
      data: entries,
    });*/
    res.render("entries", { entries: entries, user: true });
  } catch (err) {
    next(err);
  }
};

// Creating an Entry
exports.create = async (id, req, res, next) => {
  try {
    // Getting all entries
    const entries = await entryModel.find({ parent: id });

    // Sending the response
    /*res.status(200).json({
      status: "Success",
      data: entries,
    });*/
    res.render("create", { user: true });
  } catch (err) {
    next(err);
  }
};

// Creating an Entry
exports.createEntry = async (id, req, res, next) => {
  try {
    // Getting data from the body
    let { title, data } = req.body;

    // Creating the entry
    const entry = await entryModel.create({
      title: title,
      data: data,
      parent: id,
    });

    // Checking if an entry with the same title exists
    if (!entry) return next(new Error("Entry already exists"));

    // Sending the response
    /*return res.status(200).json({
      status: "Success",
      data: entry,
    });*/
    res.redirect("/entries");
  } catch (err) {
    next(err);
  }
};

// Getting an Entry
exports.getEntry = async (id, req, res, next) => {
  try {
    // Getting the entry title
    const { title } = req.params;
    // Checking if the entry exists
    const entry = await entryModel.findOne({
      title: title.replace("%20", " "),
      parent: id,
    });
    if (!entry) return next(new Error("Entry does not exist"));

    // Sending the response
    res.render("entry", { entry: entry, user: true });
    /*res.status(200).json({
      status: "Success",
      data: entry,
    });*/
  } catch (err) {
    next(err);
  }
};

// Updating an Entry
module.exports.updateEntry = async (id, req, res, next) => {
  try {
    // Getting the title and data from the body
    const { title } = req.params;
    const { data } = req.body;
    const updatedTitle = req.body.title;

    // Updating the entry
    let updated = await entryModel.findOneAndUpdate(
      { parent: id, title: title.replace("%20", " ") },
      {
        title: updatedTitle,
        data: data,
      }
    );

    // Checking if the entry exists
    if (!updated) return next(new Error("Entry does not exist"));

    // Saving the updated entry
    await updated.save();

    // Sending the response
    res.render("success", {
      message: "Entry updated successfully!",
      user: true,
    });
    /*res.status(200).json({
      status: "Success",
      data: updated,
    });*/
  } catch (err) {
    next(err);
  }
};

// Deleting an Entry
module.exports.deleteEntry = async (id, req, res, next) => {
  try {
    // Getting the title from the params
    const { title } = req.params;

    // Deleting the entry
    let deleted = await entryModel.findOneAndDelete({
      title: title.replace("%20", " "),
      parent: id,
    });

    // Checking if the entry exists
    if (!deleted) return next(new Error("Entry does not exist"));

    // Sending the response
    res.redirect("/entries");
    /*res.status(200).json({
      status: "Success",
      data: deleted,
    });*/
  } catch (err) {
    next(err);
  }
};

module.exports.deleteAll = async (id, req, res, next) => {
  res.render("deleteAllEntries", { user: true });
};

// Deleting all Entries
module.exports.deleteAllEntries = async (id, req, res, next) => {
  try {
    // Deleting all entries
    const user = await entryModel.deleteMany({ parent: id });
    // Sending the response
    /*res.status(200).json({
      status: "Success",
      data: user,
    });*/
    return res.render("success", {
      message: "All entries deleted successfully!",
      user: true,
    });
  } catch (err) {
    next(err);
  }
};
