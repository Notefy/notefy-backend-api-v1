const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const User = require("./user.model");

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ msg: "Authentication invalid" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.userID);

        if (!user)
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ msg: "Invalid Credentials" });

        req.userID = payload.userID;
        req.user = user;
        next();
    } catch (error) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ msg: "Authentication invalid" });
    }
};

module.exports = auth;
