const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const Folder = require("../models/folders");
const User = require("../models/user");

const getFolder = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "Dev" });
};

const createFolder = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "Dev" });
};

const updateFolder = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "Dev" });
};

const deleteFolder = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "Dev" });
};

module.exports = { getFolder, createFolder, updateFolder, deleteFolder };
