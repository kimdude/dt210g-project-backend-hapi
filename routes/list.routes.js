"use strict"

/* Routes handling users list of saved games */
const list = require("../controllers/list.controller");

module.exports = (server) => {
    server.route([

        //Getting saved games
        {
            method: "GET",
            path: "/saved",
            handler: list.getList,
            options: {
                auth: {
                    strategy: "jwt"
                }
            }
        },

        //Saving game to list
        {
            method: "POST",
            path: "/saved/{_id}",
            handler: list.addList,
            options: {
                auth: {
                    strategy: "jwt"
                }
            }
        },

        //Removing game from list
        {
            method: "DELETE",
            path: "/saved/{_id}",
            handler: list.deleteList,
            options: {
                auth: {
                    strategy: "jwt"
                }
            }
        }

    ]);
}