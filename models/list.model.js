/* Model for saved list collection */
const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game"
    }]
});

module.exports = mongoose.model("List", ListSchema);