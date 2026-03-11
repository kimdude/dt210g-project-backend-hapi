"use strict"

/* Authorized routes */
const user = require("../controllers/profile.controller");
const Joi = require("joi");

module.exports = (server) => {
    server.route([

        //Getting user data
        {
            method: "GET",
            path: "/profile",
            handler: user.getUser,
            options: {
                auth: {
                    strategy: "jwt"
                }
            }
        },

        //Getting reviews made by user
        {
            method: "GET",
            path: "/profile/reviews",
            handler: user.getReviews,
            options: {
                auth: {
                    strategy: "jwt"
                }
            }
        },

        //Updating password
        {
            method: "PUT",
            path: "/profile",
            handler: user.updateUser,
            options: {
                auth: {
                    strategy: "jwt"
                },
                validate: {
                    payload: Joi.object({
                        password: Joi.string().min(8).required(),
                        newPassword: Joi.string().min(8).required()
                    })
                }
            }
        },

        //Authorizing token 
        {
            method: "GET",
            path: "/validate",
            handler: (request, h) => {
                const user = request.auth.credentials;

                if(!user) {
                    return h.response({message: "Invalid token"}).code(401);
                }

                return h.response(user).code(200);
            },
            options: {
                auth: {
                    strategy: "jwt"
                }
            }
        }

    ]);
}