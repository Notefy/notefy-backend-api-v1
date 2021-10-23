const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const defaultPath = JSON.stringify({
    root: {},
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, `Name is required`],
        maxlength: 50,
        minLength: 3,
    },
    email: {
        type: String,
        require: [true, `Email is required`],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ],
        unique: true,
    },
    password: {
        type: String,
        require: [true, `Password is required`],
        minLength: 5,
    },
    tags: {
        type: [String],
        default: ["delete", "archive"],
    },
    path: {
        type: String,
        default: defaultPath,
    },
});

UserSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userID: this._id, name: this.name, email: this.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    );
};

UserSchema.methods.isPasswordCorrect = async function (givenPassword) {
    return await bcrypt.compare(givenPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
