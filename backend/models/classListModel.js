const mongoose = require("mongoose");

const ClassListItemSchema = new mongoose.Schema({
    "Student ID": String,
    "Class ID": String,
    "Assignment ID": String,
});

const ClassListSchema = new mongoose.Schema({
    "class-list": [ClassListItemSchema],
});

const ClassListModel = mongoose.model("ClassListModel", ClassListSchema);

module.exports = ClassListModel;
