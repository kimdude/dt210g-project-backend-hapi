"use strict"

/* Controller to handle users saved games-list */
const game = require("../models/game.model");
const list = require("../models/list.model");

const service = require("../services/freeToGame.service");
const { isValidObjectId } = require("mongoose");

//Getting saved games
exports.getList = async(request, h) => {
    try {
        const { _id } = request.auth.credentials;

        const savedGames = await list.aggregate([
            {
                $match: {
                    userId: _id
                }
            },
            {         
                $lookup: {
                    from: "games",
                    localField: "games",
                    foreignField: "_id",
                    as: "gameDetails"
                }
            },
            { $unwind: "$gameDetails" },
            { $replaceRoot: { newRoot: "$gameDetails" }}
        ]);

        if(!savedGames || savedGames.length === 0) {
            return h.response({ error: "No list found." }).code(404);
        }

        return h.response({ list: savedGames }).code(200);

    } catch(error) {
        return h.response({ error: "An error occurred fetching list." }).code(500);
    }
}


//Saving game to list
exports.addList = async(request, h) => {
    try {
        const userId = request.auth.credentials._id;
        const externalId = request.params._id;

        let internalId;
        let title;

        //Validating ID
        const validId = await game.findOne({ gameId: externalId });

        if(!validId) {
            const freeToGame = await service.freeToGame("game?id=" + externalId);

            if (!freeToGame) {
                return h.response({ error: "Invalid game ID."}).code(404);
            }

            //Saving game to games-collection
            const newGame = new game({ gameId: externalId, name: freeToGame.title });
            const storedGame = await newGame.save();
            
            internalId = storedGame._id;
            title = storedGame.name;

        } else {
            internalId = validId._id;
            title = validId.name;
        }

        //Checking if list already exists
        const existingList = await list.findOne({ userId: userId });

        if(!existingList) {

            //Saving game to users list
            const savedGame = new list({ userId: userId, games: [internalId] });
            await savedGame.save();

        } else {
            await list.updateOne({ userId }, { $addToSet: { games: internalId }});
        }

        return h.response({ message: "Game Saved", game: title }).code(200);

    } catch(error) {
        return h.response({error: "An error occurred saving game to list. Try again later. "}).code(500);
    }
}


//Removing game from list
exports.deleteList = async(request, h) => {
    try {
        const userId = request.auth.credentials._id;
        const gameId = request.params._id;

        if(!isValidObjectId(gameId)) {
            return h.response({ error: "Invalid game ID." }).code(404);
        }

        const result = await list.updateOne({ userId: userId }, { $pull: { games: { $in: [gameId] }}});

        if(result.modifiedCount === 0) {
            return h.response({ error: "Invalid game ID." }).code(404);
        }

        return h.response({ message: "Game removed from list." }).code(200);
        
    } catch(error) {
        return h.response({ message: "An error occurred while removing game from list. Please try again later." }).code(500);
    }
}