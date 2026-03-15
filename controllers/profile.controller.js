"use strict"

/* Controller for authorized user routes */
const bcrypt = require("bcrypt");

//Requiring models
const user = require("../models/user.model");
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

//Getting users reviews
exports.getReviews = async(request, h) => {
    try {
        const { _id } = request.auth.credentials;

        //Getting reviews by userId and joining with corresponding games doc
        const sharedReviews = await review.aggregate([
            {
                $match: {
                    userId: _id
                }
            },
            {
                $lookup: {
                    from: "games",
                    localField: "gameId",
                    foreignField: "_id",
                    as: "gameDetails"
                }
            }, 
            {
                $project: {
                    "gameDetails._id": 0
                }
            },        
            { $unwind: "$gameDetails" },
            { $sort: {  "createdAt": -1 }}
        ])

        if(!sharedReviews) {
            return h.response({ message: "No reviews found." }).code(200);
        }

        return h.response(sharedReviews).code(200);  

    } catch(error) {
        return h.response({ error: "An error occurred fetching reviews." }).code(500)
    }
}


//Updating password
exports.updateUser = async(request, h) => {
    try {
        const { _id } = request.auth.credentials;
        const { password, newPassword } = request.payload;

        if(!password || !newPassword) {
            return h.response({ error: "Current password and new password must be given."}).code(400);
        }

        //Validating user
        const validUser = await user.findOne({ _id }).select("+password");

        if(!validUser) {
            return h.response({ error: "An error occurred finding user." }).code(500);
        }

        //Validating password
        const validCredentials = await bcrypt.compare(password, validUser.password);

        if(!validCredentials) {
            return h.response({ error: "Current password or new password are invalid. Password must be over 8 characters long." }).code(400);
        }

        //Adding user
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        validUser.password = hashedPassword;
        await validUser.save();

        return h.response({ message: "Password updated." }).code(200);

    } catch(error) {
        return h.response({ error: "An error occurred updating user." }).code(500);
    }
}