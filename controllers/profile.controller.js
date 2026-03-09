/* Controller to authorized routes */
const bcrypt = require("bcrypt");

//Requiring models
const user = require("../models/user.model");
const list = require("../models/list.model");
const review = require("../models/review.model");

//Getting user data
exports.getUser = async(request, h) => {
    try {

        //Validating current user
        const { username } = request.auth.credentials;

        const currentUser = await user.findOne({ username: username });

        if(!currentUser) {
            return h.response({ error: "User not found."}).code(404);
        }

        return h.response({ user: currentUser }).code(200);

    } catch(error) {
        return h.response({ error: "An error occurred fetching user. Please try again later." }).code(500);
    }
}


//Getting saved games
exports.getList = async(request, h) => {
    try {
        const { username } = request.auth.credentials;

        const savedGames = await list.findOne({ username: username });

        if(!savedGames) {
            return h.response({ error: "No list found." }).code(404);
        }

        return h.response({ list: savedGames }).code(200);

    } catch(error) {
        return h.response({ error: "An error occurred fetching list." }).code(500);
    }
}


//Getting users reviews
exports.getReviews = async(request, h) => {
    try {
        

    } catch(error) {
 
    }
}


//Updating password
exports.updateUser = async(request, h) => {
    try {
        

    } catch(error) {
 
    }
}