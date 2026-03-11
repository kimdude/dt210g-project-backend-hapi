"use strict"

/* Routes handling games */
const game = require("../controllers/game.controller");

module.exports = (server) => {
    server.route([

        //Getting all games
        {
            method: "GET",
            path: "/games",
            handler: game.getAllGames
        },

        //Getting specific games
        {
            method: "GET",
            path: "/games/{_id}",
            handler: game.getGame,
            options: {
                auth: {
                    mode: "optional",
                    strategy: "jwt"
                }
            }
        },

        //Adding review
        {
            method: "POST",
            path: "/games/{_id}",
            handler: game.addReview,
            options: {
                auth: {
                    strategy: "jwt"
                }
            }
        },

        //Updating review
        {
            method: "PUT",
            path: "/games/reviews/{_id}",
            handler: game.updateReview,
            options: {
                auth: {
                    strategy: "jwt"
                }
            }
        },

        //Deleting review
        {
            method: "DELETE",
            path: "/games/reviews/{_id}",
            handler: game.deleteReview,
            options: {
                auth: {
                    strategy: "jwt"
                }
            }
        }

    ]);
}