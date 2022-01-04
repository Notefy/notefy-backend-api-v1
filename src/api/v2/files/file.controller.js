const { StatusCodes } = require("http-status-codes");

const { folderModel: Folder, folderHelper } = require("../folders");
const { noteModel: Note, noteHelper } = require("../notes");

const { getFilesAtPathByUser } = require("./file.helper");

const getFilesAtRoot = async (req, res) => {
    const result = await getFilesAtPathByUser({
        createdBy: req.userID,
        path: { $size: 1 },
    });
    return res.status(StatusCodes.OK).json(result);
};

const getFile = async (req, res) => {
    const fileID = req.params.id;

    // Check if fileID is a folder
    const file = await Folder.findOne({
        _id: fileID,
        createdBy: req.userID,
    });
    if (file) {
        const subFilePath = [...file.path, file.name];
        const children = await getFilesAtPathByUser({
            createdBy: req.userID,
            path: subFilePath,
        });
        const result = { ...file._doc, children };
        console.log(file);
        return res.status(StatusCodes.OK).json(result);
    }

    // Check if fileID is a note
    const note = await Note.findOne({
        _id: fileID,
        createdBy: req.userID,
    });
    if (note) return res.status(StatusCodes.OK).json({ note });

    return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No file with id: ${fileID}` });
};

const createFile = async (req, res) => {
    const folderType = req.body.type;

    if (folderType === "folder") {
        const folder = await folderHelper.createFolder({
            folderName: req.body.name,
            folderColor: req.body.color,
            folderTags: req.body.tags,
            folderPathString: req.body.path,
            createdBy: req.userID,
        });

        return res.status(StatusCodes.OK).json({ folder });
    }

    if (folderType === "note") {
        const note = await noteHelper.createNote({
            noteTitle: req.body.title,
            noteData: req.body.data,
            noteTags: req.body.tags,
            notePathString: req.body.path,
            createdBy: req.userID,
        });
        return res.status(StatusCodes.OK).json({ note });
    }

    return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Wrong folder type" });
};

const updateFile = async (req, res) => {
    const fileID = req.params.id;

    // Check if fileID is a folder
    const file = await Folder.findOne({
        _id: fileID,
        createdBy: req.userID,
    });
    if (file) {
        const result = await folderHelper.updateFolder({
            folderID: fileID,
            updateType: req.body.type,
            newFolderName: req.body.name,
            newFolderColor: req.body.color,
            newFolderTags: req.body.tags,
            newFolderPathString: req.body.path,
            createdBy: req.userID,
        });
        return res.status(StatusCodes.OK).json({ result });
    }

    // Check if fileID is a note
    const note = await Note.findOne({
        _id: fileID,
        createdBy: req.userID,
    });
    if (note) {
        const result = await noteHelper.updateNote({
            noteID: fileID,
            newNoteTitle: req.body.title,
            newNoteData: req.body.data,
            newNoteTags: req.body.tags,
            newNotePathString: req.body.path,
            createdBy: req.userID,
        });
        return res.status(StatusCodes.OK).json({ result });
    }

    return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No file with id: ${fileID}` });
};

const deleteFile = async (req, res) => {
    const fileID = req.params.id;

    // Check if fileID is a folder
    const file = await Folder.findOne({
        _id: fileID,
        createdBy: req.userID,
    });
    if (file) {
        const result = await folderHelper.deleteFolder({
            folderID: fileID,
            createdBy: req.userID,
        });
        return res.status(StatusCodes.OK).json({ result });
    }

    // Check if fileID is a note
    const note = await Note.findOne({
        _id: fileID,
        createdBy: req.userID,
    });
    if (note) {
        const result = await noteHelper.deleteNote({
            noteID: fileID,
            createdBy: req.userID,
        });
        return res.status(StatusCodes.OK).json({ result });
    }

    return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No file with id: ${fileID}` });
};

module.exports = {
    getFilesAtRoot,
    getFile,
    createFile,
    updateFile,
    deleteFile,
};
