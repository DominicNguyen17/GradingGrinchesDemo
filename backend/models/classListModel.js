const mongoose = require("mongoose");

const RatingItem = new mongoose.Schema({
    "question_title": String,
    "mark": Number,
    "feedback": String,
    "customFeedback": String,
    "customMark": Number,
});


const ClassListItemSchema = new mongoose.Schema({
    "Student UPI": String,
    "Student Name": String,
    "Class ID": String,
    "Assignment ID": String,
    "Mark Status": { type: Boolean, default: false },
    "Marks": [RatingItem],
});


const ClassListSchema = new mongoose.Schema({
    "Rubric ID": {type: String, default: ""},
    "class-list": [ClassListItemSchema],
}, {
    versionKey: false
});

const ClassListModel = mongoose.model("ClassListModel", ClassListSchema);

module.exports = ClassListModel;
