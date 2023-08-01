// Required Imports
const entryModel = require("../models/entryModel");
const userModel = require("../models/userModel");

// Getting all Entries
exports.getAllEntries = async (id, req, res, next) => {
  try {
    const entries = await entryModel.find({ parent: id });
    console.log(id);
    res.status(200).json({
      status: "Success",
      data: entries,
    });
  } catch (err) {
    next(err);
  }
};

// Creating an Entry
exports.createEntry = async (id, req, res, next) => {
  try {
    let { title, data } = req.body;
    const entry = await entryModel.create({
      title: title,
      data: data,
      parent: id,
    });
    return res.status(200).json({
      status: "Success",
      data: entry,
    });
  } catch (err) {
    next(err);
  }
};

// Getting an Entry
exports.getEntry = async (id, req, res, next) => {
  try {
    const { title } = req.params;
    const entry = await entryModel.findOne({ title: title, parent: id });
    if (!entry) return next(new Error("Entry does not exist"));
    res.status(200).json({
      status: "Success",
      data: entry,
    });
  } catch (err) {
    next(err);
  }
};

// Updating an Entry
module.exports.updateEntry = async (id, req, res, next) => {
  try {
    const { title } = req.params;
    const { data } = req.body;
    const updatedTitle = req.body.title;
    let updated = await entryModel.findOneAndUpdate(
      { parent: id },
      {
        title: updatedTitle,
        data: data,
      }
    );
    await updated.save();
    res.status(200).json({
      status: "Success",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// Deleting an Entry

module.exports.deleteEntry = async (id, req, res, next) => {
  try {
    const { title } = req.params;
    let deleted = await entryModel.findOneAndDelete({
      title: title,
      parent: id,
    });
    res.status(200).json({
      status: "Success",
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
};

// Deleting all Entries
module.exports.deleteAllEntries = async (id, req, res, next) => {
  try {
    const user = await entryModel.deleteMany({ parent: id });
    res.status(200).json({
      status: "Success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
