/* Controller to handle users saved games-list */
const game = require("../models/game.model");
const list = require("../models/list.model");

//Getting saved games
exports.getList = async(request, h) => {
    try {
        const { _id } = request.auth.credentials;

        const savedGames = await list.findOne({ userId: _id });

        if(!savedGames) {
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
                return h.response({ error: "Invalid game Id."}).code(404);
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
        return h.response({error: "An error occurred saving game to list. Please try again later. "}).code(500);
    }
}


//Removing game from list
exports.deleteList = async(request, h) => {
    try {
        const userId = request.auth.credentials._id;
        const gameId = request.params._id;

        await list.updateOne({ userId: userId }, { $pull: { games: { $in: [gameId] }}});

        return h.response({ message: "Game removed from list." }).code(200);
        
    } catch(error) {
        return h.response({ message: "An error occurred while removing game from list. Please try again later." }).code(500);
    }
}