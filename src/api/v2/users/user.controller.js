const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const User = require("./user.model");

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (await User.findOne({ email }))
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ msg: "User with Name or Email Exists" });

    const user = await User.create({ name, email, password });

    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({
        user: {
            name: user.name,
            email: user.email,
            theme: user.theme,
        },
        token,
    });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "Please provide email and password" });

    const user = await User.findOne({ email });
    if (!user)
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ msg: "Invalid Credentials" });

    if (!(await user.isPasswordCorrect(password)))
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ msg: "Invalid Credentials" });

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({
        user: {
            name: user.name,
            email: user.email,
            theme: user.theme,
        },
        token,
    });
};

const updateUser = async (req, res) => {
    const userObjectId = mongoose.Types.ObjectId(req.userID);

    const updatedUser = await User.findByIdAndUpdate(
        userObjectId,
        {
            name: req.body.name,
            email: req.body.email,
            theme: req.body.theme,
        },
        { new: true, runValidators: true }
    );
    const token = updatedUser.createJWT();

    res.status(StatusCodes.OK).json({
        user: {
            name: updatedUser.name,
            email: updatedUser.email,
            theme: updatedUser.theme,
        },
        token,
    });
};

const deleteUser = async (req, res) => {
    const userObjectId = mongoose.Types.ObjectId(req.userID);
    const { password } = req.body;

    if (!password)
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "Please provide email and password" });

    const user = await User.findById(userObjectId);
    if (!user)
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ msg: "Invalid Credentials" });

    if (!(await user.isPasswordCorrect(password)))
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ msg: "Invalid Credentials" });

    // TODO: Delete the notes and folder by user
    const deletedUser = await User.findByIdAndDelete(userObjectId);

    res.status(StatusCodes.OK).json({
        msg: `${deletedUser.name} deleted`,
    });
};

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
};
