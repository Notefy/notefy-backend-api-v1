const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const Folder = require("../models/folders.model");
const User = require("../models/user.model");
const Note = require("../models/notes.model");

const getFilesAtPath = async (req, res) => {
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

const getFile = async (req, res) => {
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

module.exports = { getFilesAtPath, getFile };
