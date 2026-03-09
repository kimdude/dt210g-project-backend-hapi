/* Controller to handle user */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const user = require("../models/user.model");

//Adding user
exports.addUser = async(request, h) => {
    try {
        const { username, displayName, password } = request.payload;

        //Hashing password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await new user({ username: username, displayName: displayName, password: hashedPassword });
        await newUser.save();

        return h.response({ message: "User added" }).code(200);

    } catch(error) {
 
        if(error.code === 11000) {
            return h.response({ error: "Invalid username or display name. Please try again." }).code(409);
        }

        return h.response({ error: "An error occurred storing user. Please try again later." }).code(500);
    }
}

//Logging in user
exports.loginUser = async(request, h) => {
    try {
        const { username, password } = request.payload;

        //Validating user
        const validUser = await user.findOne({ username }).select("+password");

        if(!validUser) {
            throw new Error("Invalid username or password");
        }

        const validCredentials = await bcrypt.compare(password, validUser.password);

        if(!validCredentials) {
            throw new Error("Invalid username or password");
        }

        //Creating token
        const payload = { id: validUser._id, username: validUser.username, displayName: validUser.displayName };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" } );

        return h.response({ id: validUser._id, username: validUser.username, displayName: validUser.displayName, token: token });
    
    } catch(error) {

        console.log(error)

        if(error.message === "Invalid username or password") {
            return h.response({ error: error.message }).code(401);
        }

        return h.response({ error: "An error occurred during login. Please try again later." }).code(500);

    }
}