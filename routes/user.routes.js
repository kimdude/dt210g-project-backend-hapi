"use strict"

/* Routes handling users */
const user = require("../controllers/user.controller");
const Joi = require("joi");

module.exports = (server) => {
    server.route([

        //Adding user
        {
            method: "POST",
            path: "/user/register",
            handler: user.addUser,
            options: {
                validate: {
                    payload: Joi.object({
                        username: Joi.string().min(4).max(15).required(),
                        displayName: Joi.string().min(4).max(15).required(),
                        password: Joi.string().min(8).required()
                    })
                }
            }
        },

        //Logging in user
        {
            method: "POST",
            path: "/user/login",
            handler: user.loginUser,
            options: {
                validate: {
                    payload: Joi.object({
                        username: Joi.string().min(4).max(15).required(),
                        password: Joi.string().min(8).required()
                    })
                }
            }
        }

    ]);
}