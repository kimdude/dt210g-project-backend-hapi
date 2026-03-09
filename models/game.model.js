/* Model for game collection */
const mongoose = require("mongoose");

const GameSchema = mongoose.Schema({
    gameId: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        minlength: 1
    },
    score: {
        type: Number,
        min: 0,
        max: 5
    }
});

module.exports = mongoose.model("Game", GameSchema);