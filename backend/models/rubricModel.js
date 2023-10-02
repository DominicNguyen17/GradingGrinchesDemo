const mongoose = require("mongoose");

const FeedbackItemSchema = new mongoose.Schema({
    "feedback": String,
});

const RubricItemSchema = new mongoose.Schema({
    "question_title": String,
    "marks": Number,
    "marker comments": String,
    "feedbacks": [FeedbackItemSchema],
});

const RubricSchema = new mongoose.Schema({
    "owner": String,
    "assignment title": String,
    "rubric": [RubricItemSchema],
}, {
    versionKey: false
});

const RubricModel = mongoose.model("RubricModel", RubricSchema);

module.exports = RubricModel;
