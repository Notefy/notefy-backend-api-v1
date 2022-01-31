const Note = require("./note.model");

const { folderHelper } = require("../folders");

const createNote = async ({
    noteTitle,
    noteData,
    noteTags,
    notePathString,
    createdBy,
}) => {
    const folderPath = notePathString.split("/");

    // Folder path exists
    const validFolderPath = await folderHelper.doesFolderWithPathAndNameExists({
        folderPath: folderPath.slice(0, folderPath.length - 1),
        folderName: folderPath[[folderPath.length - 1]],
        createdBy: createdBy,
    });

    if (!(folderPath.length === 1 || validFolderPath))
        return { msg: "Folder Doesnt Exists" };

    // Insert
    const note = await Note.create({
        title: noteTitle,
        data: noteData,
        tags: noteTags,
        path: folderPath,
        createdBy: createdBy,
    });

    return { note };
};

const updateNote = async ({
    noteID,
    newNoteTitle,
    newNoteData,
    newNoteTags,
    newNotePath,
    createdBy,
}) => {
    // const notePath = newNotePath.split("/");

    // Folder path exists
    const validFolderPath = await folderHelper.doesFolderWithPathAndNameExists({
        folderPath: newNotePath.slice(0, newNotePath.length - 1),
        folderName: newNotePath[[newNotePath.length - 1]],
        createdBy: createdBy,
    });
    if (!(newNotePath.length === 1 || validFolderPath))
        return { msg: "Folder Doesnt Exists" };

    const note = await Note.findOneAndUpdate(
        { _id: noteID, createdBy: createdBy },
        {
            title: newNoteTitle,
            data: newNoteData,
            tags: newNoteTags,
            path: newNotePath,
        },
        { new: true, runValidators: true }
    );

    if (!note) return { msg: `No note with id: ${noteID}` };
    return { status: "success", msg: `Note Updated`, note };
};

const deleteNote = async ({ noteID, createdBy }) => {
    const note = await Note.findOneAndDelete({
        _id: noteID,
        createdBy: createdBy,
    });

    if (!note) return { msg: `No note with id: ${noteID}` };
    return { status: "success", msg: `Note Deleted` };
};

module.exports = {
    createNote,
    updateNote,
    deleteNote,
};
