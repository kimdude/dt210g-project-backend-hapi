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
        const gameId = request.params._id;


    } catch(error) {
        
    }
}


//Removing game from list
exports.deleteList = async(request, h) => {
    try {
        const userId = request.auth.credentials._id;
        const gameId = request.params._id;

        
    } catch(error) {
        
    }
}