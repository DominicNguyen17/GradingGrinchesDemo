const mongoose = require("mongoose");

const RatingItemSchema = new mongoose.Schema({
    "mark": Number,
    "feedbacks": [String],
});


const RubricItemSchema = new mongoose.Schema({
    "question_title": String,
    "marks": Number,
    "ratings": [RatingItemSchema],
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
