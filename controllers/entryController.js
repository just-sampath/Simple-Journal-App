// Required Imports
const entryModel = require("../models/entryModel");
const userModel = require("../models/userModel");

// Getting all Entries
exports.getAllEntries = async (id, req, res, next) => {
  try {
    const entries = await userModel.findById(id);
    res.status(200).json({
      status: "Success",
      data: await entries.populate("journals"),
    });
  } catch (err) {
    next(err);
  }
};

// Creating an Entry
exports.createEntry = async (id, req, res, next) => {
  try {
    let { title, data } = req.body;
    const entry = await entryModel.create({ title: title, data: data });
    const user = await userModel.findById(id).populate("journals");
    const entryExists = await user.journals.filter((en) => en.title === title);
    if (entryExists.length > 0)
      return res
        .status(400)
        .json({ msg: "Entry with the same title already exists" });
    user.journals.push(entry);
    await user.save();
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
    const user = await userModel.findById(id).populate("journals");
    const entry = await user.journals.filter((en) => en.title === title);
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
    const user = await userModel.findById(id).populate("journals");
    const entry = await user.journals.filter((en) => en.title === title);
    if (entry.length === 0)
      return res.status(400).json({ msg: "Entry doesn't exist" });
    let updated = await entryModel.findByIdAndUpdate(entry[0].id, {
      title: updatedTitle,
      data: data,
    });
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
    const user = await userModel.findById(id).populate("journals");
    const entry = await user.journals.filter((en) => en.title === title);
    if (entry.length === 0)
      return res.status(400).json({ msg: "Entry doesn't exist" });
    let deleted = await entryModel.findByIdAndDelete(entry[0].id);
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
    const user = await userModel.findByIdAndUpdate(id, { journals: [] });
    res.status(200).json({
      status: "Success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
