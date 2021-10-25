const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const Note = require("../models/notes");
const User = require("../models/user");

const getAllNotes = async (req, res) => {
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

const createNote = async (req, res) => {
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

    const userObjectId = mongoose.Types.ObjectId(userID);
    const currentAvailableUsertags = (await User.findById(userObjectId)).tags;

    const validTags = req.body.tags.filter(
        (tag) => currentAvailableUsertags.indexOf(tag) != -1
    );

    const note = await Note.findOneAndUpdate(
        { _id: noteID, createdBy: userID },
        {
            data: req.body.data,
            tags: validTags,
            path: req.body.path,
            createdBy: userID,
        },
        {
            new: true,
            runValidators: true,
        }
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

module.exports = {
    getAllNotes,
    createNote,
    getNote,
    updateNote,
    deleteNote,
};
