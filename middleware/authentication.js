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
        req.user = {
            userID: payload.userID,
            email: payload.email,
            name: payload.name,
        };
        next();
    } catch (error) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ msg: "Authentication invalid" });
    }
};

module.exports = auth;
