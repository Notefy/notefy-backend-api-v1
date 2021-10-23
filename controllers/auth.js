const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const User = require("../models/user");
const Note = require("../models/notes");

const register = async (req, res) => {
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
            tags: user.tags,
            path: JSON.parse(user.path),
        },
        token,
    });
};

const login = async (req, res) => {
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
            tags: user.tags,
            path: JSON.parse(user.path),
        },
        token,
    });
};

const validPath = ({ folderStructure, path }) => {
    let temp = folderStructure;
    for (const val of path) {
        if (Object.keys(temp).indexOf(val) === -1) return false;
        temp = temp[val];
    }
    return true;
};

const updateUser = async (req, res) => {
    const userObjectId = mongoose.Types.ObjectId(req.user.userID);
    const user = await User.findById(userObjectId);
    let newPath = JSON.parse(user.path);

    const { updateField } = req.body;
    if (updateField === "path") {
        const { updateType, folderDestination, newName, previousName } =
            req.body;

        let tempPath = newPath;
        for (const folder of folderDestination.split(".")) {
            if (!tempPath[folder]) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ msg: `Note content not valid` });
            }
            tempPath = tempPath[folder];
        }

        // Add Path
        if (updateType === "add") tempPath[newName] = {};

        const searchPattern = new RegExp(
            "^" +
                folderDestination.split(".").join("\\.") +
                "\\." +
                previousName +
                "\\.*"
        );

        // Update Path
        if (updateType === "update") {
            if (!tempPath.hasOwnProperty(previousName))
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ msg: `Content not valid` });

            tempPath[newName] = tempPath[previousName];
            delete tempPath[previousName];

            // Query notes to change string
            const newPathString = folderDestination + "." + newName;

            const notesToUpdate = await Note.find({
                createdBy: req.user.userID,
                path: { $regex: searchPattern },
            });
            notesToUpdate.map(async (note) => {
                await Note.deleteOne({ _id: note._id });
                await Note.create({
                    _id: note._id,
                    data: note.data,
                    tags: note.tags,
                    path: note.path.replace(searchPattern, newPathString),
                    createdBy: note.createdBy,
                });
            });
        }

        // Delete Path
        if (updateType === "delete") {
            delete tempPath[previousName];
            await Note.deleteMany({
                path: { $regex: searchPattern },
                createdBy: req.user.userID,
            });
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        userObjectId,
        {
            name: user.name,
            email: user.email,
            tags: user.tags,
            path: updateField === "path" ? JSON.stringify(newPath) : user.path,
        },
        { new: true, runValidators: true }
    );
    const token = updatedUser.createJWT();

    res.status(StatusCodes.OK).json({
        user: {
            name: updatedUser.name,
            email: updatedUser.email,
            tags: updatedUser.tags,
            path: JSON.parse(updatedUser.path),
        },
        token,
    });
};

module.exports = {
    register,
    login,
    updateUser,
};
