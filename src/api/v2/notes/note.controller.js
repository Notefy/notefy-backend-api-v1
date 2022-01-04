const { StatusCodes } = require("http-status-codes");

const Note = require("./note.model");
const { folderModel: Folder } = require("../folders");

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
