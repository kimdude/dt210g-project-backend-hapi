/* Schema for user collection */
const mongoose = require("mongoose");

//User data schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 15
    },
    displayName: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 15
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    }
});

module.exports = mongoose.model("User", UserSchema);