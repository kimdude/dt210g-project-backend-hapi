"use strict"

/* Routes handling users */
const user = require("../controllers/user.controller");

module.exports = (server) => {
    server.route([

        //Adding user
        {
            method: "POST",
            path: "/user/register",
            handler: user.addUser
        },

        //Logging in user
        {
            method: "POST",
            path: "/user/login",
            handler: user.loginUser
        }

    ]);
}