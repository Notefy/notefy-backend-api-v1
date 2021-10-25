const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const Folder = require("../models/folders");
const User = require("../models/user");

const getFolder = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "Dev" });
};

// Takes a folderPath, folderName and user and returns true or false if folder with path exists
const doesFolderWithPathAndNameExists = async ({
    folderPath,
    folderName,
    user,
}) => {
    const folderlist = await Folder.find({
        path: folderPath,
        user,
    }).select("name path -_id");
    return Object.values(folderlist.map((_) => _.name)).includes(folderName);
};

const createFolder = async (req, res) => {
    const folderName = req.body.name;
    const folderColor = req.body.color;
    const folderTags = req.body.tags;
    const folderPathString = req.body.path || "";
    const folderPath = folderPathString.split("/");

    // console.log(folderPathString);
    console.log(folderPath);

    // Folder path exists
    const validFolderPath = await doesFolderWithPathAndNameExists({
        folderPath: folderPath.slice(0, folderPath.length - 1),
        folderName: folderPath[[folderPath.length - 1]],
        user: req.userID,
    });
    console.log(
        "validFolderPath: " + (folderPath.length === 1 || validFolderPath)
    );
    if (!(folderPath.length === 1 || validFolderPath))
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ msg: "Folder Doesnt Exists" });

    // Duplicate folder check
    const duplicateFolder = await doesFolderWithPathAndNameExists({
        folderPath,
        folderName,
        user: req.userID,
    });
    console.log("duplicateFolder: " + duplicateFolder);
    if (duplicateFolder)
        return res
            .status(StatusCodes.OK)
            .json({ msg: "Folder Already Exists" });

    // // Insert
    const folder = await Folder.create({
        name: folderName,
        path: folderPath,
        tags: folderTags,
        color: folderColor,
        createdBy: req.userID,
    });
    return res.status(StatusCodes.OK).json({ folder });
};

const updateFolder = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "Dev" });
};

const deleteFolder = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "Dev" });
};

module.exports = { getFolder, createFolder, updateFolder, deleteFolder };
