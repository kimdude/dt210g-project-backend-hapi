"use strict"

/* Controller for game routes */
const user = require("../models/user.model");
const list = require("../models/list.model");
const review = require("../models/review.model");
const game = require("../models/game.model");

const service = require("../services/freeToGame.service");

//Getting all games
exports.getAllGames = async(request, h) => {
    try {

        let query = null;

        //Checking for query
        const platform = request.query?.platform;
        const category = request.query?.category;

        if(platform && category) {
            query = "games?platform=" + platform + "&category=" + category;
        } else if(platform) {
            query = "games?platform=" + platform;
        } else if(category) {
            query = "games?category=" + category;
        }

        const result = await service.freeToGame(query);
        return h.response(result).code(200);

    } catch(error) {

        if(error.message === "Invalid query.") {
            return h.response({ error: error.message }).code(404);
        }
        
        return h.response({ error: "An error occurred while fetching all games: " + error.message }).code(500);
    }
}

//Getting specific games
exports.getGame = async(request, h) => {
    try {

        const gameId = request.params._id;
        let score = null;
        let reviews = [];
        let saved = false;

        const result = await service.freeToGame("game?id=" + gameId);

        if(!result) {
            return h.response({ error: "Invalid game ID." }).code(404);
        }

        //Checking if game is stored in db
        const gameOverview = await game.findOne({ gameId: gameId });

        if(gameOverview) {
            score = gameOverview.score;

            //Checking for reviews
            const gameReviews = await review.find({ gameId: gameOverview._id });

            if(gameReviews.length > 0) {
                reviews = gameReviews;
            }

            //Checking for user
            const _id = request.auth?.credentials?._id;

            if(_id) {
                
                const userList = await list.findOne({ userId: _id, games: { $in: [gameOverview._id] }});

                if(userList) {
                    saved = true;
                }
            }
            
        }

        //Compiling response object
        const response = {
            externalId: result.id,
            title: result.title,
            released: result.released,
            developer: result.developer,
            publisher: result.publisher,
            shortDescription: result.short_description,
            description: result.description,
            genre: result.genre,
            platform: result.platform,
            releaseDate: result.release_date,
            thumbnail: result.thumbnail,
            screenshots: result.screenshots,
            score: score,
            reviews: reviews,
            saved: saved
        }

        return h.response(response).code(200);

    } catch(error) {
        return h.response({ error: "An error occurred while fetching game. Please try again later." }).code(500);
    }
}

//Adding review
exports.addReview = async(request, h) => {
    try {

        const userId = request.auth.credentials._id;
        const externalId = request.params._id;
        const { rating, title, description } = request.payload;

        let currentGame;
        let internalId;

        //Validating ID
        const validId = await game.findOne({ gameId: externalId });

        if(!validId) {
            const freeToGame = await service.freeToGame("game?id=" + externalId);

            if (!freeToGame) {
                return h.response({ error: "Invalid game Id."}).code(404);
            }

            //Saving game to games-collection
            const newGame = new game({ gameId: externalId, name: freeToGame.title });
            const storedGame = await newGame.save();
            
            currentGame = storedGame;
            internalId = storedGame._id;

        } else {
            currentGame = validId;
            internalId = validId._id;
        }

        //Creating new review
        const newReview = new review({ userId: userId, gameId: internalId, rating: rating, title: title, description: description });
        const finalReview = await newReview.save();

        //Updating games score
        const fetchedRatings = await review.find({ gameId: internalId }, { rating: 1, _id: 0 });
        const ratingsArr = fetchedRatings.map((item) => item.rating);
        const sum = ratingsArr.reduce((total, current) => total + current, 0);
        const score = sum / ratingsArr.length;

        currentGame.score = score;
        await currentGame.save();

        return h.response(finalReview).code(200);

    } catch(error) {
        return h.response({ error: "An error occurred while fetching game. Please try again later." }).code(500);
    }
}


//Updating review
exports.updateReview = async(request, h) => {
    try {
        const userId = request.auth.credentials._id;
        const reviewId = request.params._id;
        const { rating, title, description } = request.payload;

        //Validating review
        const validReview = await review.findOne({ _id: reviewId });

        if(!validReview) {
            return h.response({ error: "Invalid review ID." }).code(404);
        }

        //Validating user
        if(validReview.userId.toString() !== userId.toString()) {
            return h.response({ error: "Invalid user ID." }).code(403);
        }

        validReview.rating = rating;
        validReview.title = title;
        validReview.description = description;

        const updatedReview = await validReview.save();

        //Updating games score
        const fetchedRatings = await review.find({ gameId: validReview.gameId }, { rating: 1, _id: 0 });
        const ratingsArr = fetchedRatings.map((item) => item.rating);
        const sum = ratingsArr.reduce((total, current) => total + current, 0);
        const score = sum / ratingsArr.length;

        await game.findOneAndUpdate({ _id: validReview.gameId }, { score: score }).lean();

        return h.response(updatedReview).code(200);

    } catch(error) {
        return h.response({ error: "An error occurred while updating review. Please try again later." }).code(500);
    }
}


//Deleting review
exports.deleteReview = async(request, h) => {
    try {
        const userId = request.auth.credentials._id;
        const { _id } = request.params;

        //Checking if user created it
        const validReview = await review.findById(_id);

        if(!validReview) {
            return h.response({ error: "Invalid review ID." }).code(404);
        }

        if(validReview.userId.toString() !== userId.toString()) {
            return h.response({ error: "Invalid user ID." }).code(403);
        }

        //Deleting review
        await review.findByIdAndDelete(_id);

        return h.response({ message: "Review deleted." }).code(200);

    } catch(error) {
        return h.response({ error: "An error occurred while deleting review. Please try again later." }).code(500);
    }
}