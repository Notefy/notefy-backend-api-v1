const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const Folder = require("./folder.model");
const folderHelper = require("./folder.helper");

// TODO: Root path has to be "" or undefined
const getFolder = async (req, res) => {
    const folderID = req.params.id;
    const folder = await Folder.findOne({
        _id: folderID,
        createdBy: req.userID,
    });

    if (!folder)
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ msg: "Folder not Found" });

    folder.path.push(folder.name);
    const folderlist = await Folder.find({
        path: folder.path,
        createdBy: req.userID,
    });

    return res
        .status(StatusCodes.OK)
        .json({ folderlist, count: folderlist.length });
};

const createFolder = async (req, res) => {
    const folder = await folderHelper.createFolder({
        folderName: req.body.name,
        folderColor: req.body.color,
        folderTags: req.body.tags,
        folderPathString: req.body.path,
        createdBy: req.userID,
    });

    return res.status(StatusCodes.OK).json({ folder });
};

const updateFolder = async (req, res) => {
    const result = await folderHelper.updateFolder({
        folderID: req.params.id,
        updateType: req.body.type,
        newFolderName: req.body.name,
        newFolderColor: req.body.color,
        newFolderTags: req.body.tags,
        newFolderPathString: req.body.path,
        createdBy: req.userID,
    });
    return res.status(StatusCodes.OK).json({ result });
};

const deleteFolder = async (req, res) => {
    const result = await folderHelper.deleteFolder({
        folderID: req.params.id,
        createdBy: req.userID,
    });
    return res.status(StatusCodes.OK).json({ result });
};

module.exports = { getFolder, createFolder, updateFolder, deleteFolder };
