const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const Note = require("../models/notes.model");
const Folder = require("../models/folders.model");
const User = require("../models/user.model");

const getAllNotes_old = async (req, res) => {
    // console.log(req.query);
    // Notes by user
    let query = { createdBy: req.userID };

    // Only notes with matching path. All notes if !path
    const path = req.query.path || "/";
    if (path) query = { ...query, path };

    // Tag List filter based on exhaustive
    let tagsList;
    if (req.query.tags) tagsList = req.query.tags.split(",");

    // console.log(tagsList);
    // Note with all Tags
    const exhaustive = Boolean(req.query.exhaustive) || false;
    if (tagsList && exhaustive === true)
        query = { ...query, tags: { $all: tagsList } };
    // notes = notes.filter(
    //     (note) =>
    //         note.tags.filter((tag) => tags.indexOf(tag) != -1).length > 0
    // );

    // Note with atleast 1 Tag
    if (tagsList && exhaustive === false)
        query = { ...query, tags: { $in: tagsList } };
    // notes = notes.filter(
    //     (note) =>
    //         note.tags.filter((tag) => tags.indexOf(tag) != -1).length > 0
    // );

    let result = Note.find(query);

    // All notes Sorted by
    const sortList = req.query.sort
        ? req.query.sort.split(",").join(" ")
        : "createdAt";
    result = result.sort(sortList);

    // Only notes withing the Date

    // Only notes withing the Page and Limit
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const notes = await result;
    // console.log(notes);

    res.status(StatusCodes.OK).json({ notes, count: notes.length });
};

const validPath = ({ folderStructure, path }) => {
    let temp = folderStructure;
    for (const val of path) {
        if (Object.keys(temp).indexOf(val) === -1) return false;
        temp = temp[val];
    }
    return true;
};

const createNote__old = async (req, res) => {
    // const currentAvailableUsertags = user.tags;

    // const folderStructure = JSON.parse(user.path);
    // if (
    //     !validPath({
    //         folderStructure: folderStructure,
    //         path: req.body.path.split("."),
    //     })
    // )
    //     return res
    //         .status(StatusCodes.BAD_REQUEST)
    //         .json({ msg: `Note content not valid` });

    const note = await Note.create({
        title: req.body.title,
        data: req.body.data,
        // tags: validTags,
        tags: req.body.tags,
        path: req.body.path,
        createdBy: req.userID,
    });
    res.status(StatusCodes.CREATED).json({ note });
};

const getNote = async (req, res) => {
    const {
        userID,
        params: { id: noteID },
    } = req;
    const note = await Note.findOne({ _id: noteID, createdBy: userID });

    if (!note)
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ msg: `No note with id: ${noteID}` });

    res.status(StatusCodes.OK).json({ note });
};

const updateNote = async (req, res) => {
    const {
        userID,
        params: { id: noteID },
    } = req;

    const note = await Note.findOneAndUpdate(
        { _id: noteID, createdBy: userID },
        {
            data: req.body.data,
            tags: req.body.tags,
            path: req.body.path,
            createdBy: userID,
        },
        { new: true, runValidators: true }
    );

    if (!note)
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ msg: `No note with id: ${noteID}` });

    res.status(StatusCodes.CREATED).json({ note });
};

const deleteNote = async (req, res) => {
    const {
        userID,
        params: { id: noteID },
    } = req;
    const note = await Note.findOneAndDelete({
        _id: noteID,
        createdBy: userID,
    });

    if (!note)
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ msg: `No note with id: ${noteID}` });

    res.status(StatusCodes.OK).json({ status: "success", msg: `Note Deleted` });
};

const getAllNotes = async (req, res) => {
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
    const folderList = await Folder.find({
        path: folder.path,
        createdBy: req.userID,
    });

    const noteList = await Note.find({
        path: folder.path,
        createdBy: req.userID,
    });

    return res.status(StatusCodes.OK).json({
        folderList,
        noteList,
        folderCount: folderList.length,
        noteCount: noteList.length,
    });
};

// Takes a folderPath, folderName and user and returns true or false if folder with path exists
const doesFolderWithPathAndNameExists = async ({
    folderPath,
    folderName,
    createdBy,
}) => {
    const folderlist = await Folder.find({
        path: folderPath,
        createdBy,
    }).select("name path -_id");
    return Object.values(folderlist.map((_) => _.name)).includes(folderName);
};

const createNote = async (req, res) => {
    const folderPathString = req.body.path || "";
    const folderPath = folderPathString.split("/");

    // Folder path exists
    const validFolderPath = await doesFolderWithPathAndNameExists({
        folderPath: folderPath.slice(0, folderPath.length - 1),
        folderName: folderPath[[folderPath.length - 1]],
        createdBy: req.userID,
    });
    if (!(folderPath.length === 1 || validFolderPath))
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ msg: "Folder Doesnt Exists" });

    // Insert
    const note = await Note.create({
        title: req.body.title,
        data: req.body.data,
        tags: req.body.tags,
        path: req.body.path,
        createdBy: req.userID,
    });
    return res.status(StatusCodes.OK).json({ note });
};

module.exports = {
    getAllNotes,
    createNote,
    getNote,
    updateNote,
    deleteNote,
};
