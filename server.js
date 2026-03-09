"use strict";

//Requiring packages
require("dotenv").config();
const Hapi = require("@hapi/hapi");
const mongoose = require("mongoose");

//Requiring model
const user = require("./models/user.model");

//Validating user
const validate = async(decoded, request, h) => {
    try {
        const result = await user.findOne({_id: decoded.id});

        if(!result) {
            return { isValid: false }
        }

        //Summarizing credentials
        const currentUser = {
            _id: result._id,
            username: result.username,
            displayName: result.displayName
        }

        return { isValid: true, credentials: currentUser }

    } catch(error) {
        console.log("An error occurred during validation: " + error.message);
    }
}

//Initializing Hapi server
const init = async() => {
    const server = Hapi.server({
        port: process.env.PORT || 5000,
        host: "0.0.0.0",
        routes: {
            cors: {
                origin: ["*"],
                additionalHeaders:  ["Authorization", "Content-Type"]
            }
        }
    });

    //Connecting to MongoDB
    await mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
        console.log("Connected to MongoDB");
    }).catch((error) => {
        console.log("An error occurred connecting to database: " + error.message);
    });

    //Registering validation strategy with hapi-auth-jwt2
    await server.register(require("hapi-auth-jwt2"));
    server.auth.strategy("jwt", "jwt", {
        key: process.env.JWT_SECRET_KEY,
        validate
    })

    //Test route
    server.route({
        method: "GET",
        path: "/",
        handler: async(request, h) => {
            return h.response({ message: "Welcome!"});
        }
    });

    //Routes
    require("./routes/user.routes")(server);
    require("./routes/profile.routes")(server);
    require("./routes/list.routes")(server);
    require("./routes/game.routes")(server);

    //Starting server
    await server.start();
    console.log("Server running on %s", server.info.uri);

}

//Errors during starting server
process.on("unhandledRejection", (error) => {
    console.log("An error occurred connecting to server: " + error.message);
    process.exit(1);
});

init();