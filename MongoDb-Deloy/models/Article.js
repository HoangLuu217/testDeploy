const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    commenter: String,
    body: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    author: String,

    content: String,

    date: {
        type: Date,
        default: Date.now
    },

    comments: [commentSchema]
});

module.exports = mongoose.model("Article", articleSchema);
