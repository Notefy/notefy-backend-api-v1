const jwt = require("jsonwebtoken");

const { StatusCodes } = require("http-status-codes");

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
        req.userID = payload.userID;
        next();
    } catch (error) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ msg: "Authentication invalid" });
    }
};

module.exports = auth;
