/* Model for Review collection */
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    title: {
        type: String,
        minlength: 3,
        maxlength: 20
    },
    description: {
        type: String,
        minlength: 5
    }
},
{ timestamps: true });

module.exports = mongoose.model("Review", ReviewSchema);