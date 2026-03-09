"use strict"

/* Authorized routes */
const user = require("../controllers/profile.controller");

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