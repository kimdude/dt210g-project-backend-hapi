"use strict"

/* Routes handling users list of saved games */
const list = require("../controllers/list.controller");
const Joi = require("joi");

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
                },
                validate: {
                    params: Joi.object({
                        _id: Joi.number().min(1).required()
                    })
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
                },
                validate: {
                    params: Joi.object({
                        _id: Joi.string().required()
                    })
                }
            }
        }

    ]);
}