const { folderModel: Folder } = require("../folders");
const { noteModel: Note } = require("../notes");

const getFilesAtPathByUser = async ({ createdBy, path }) => {
    const folders = await Folder.find({
        createdBy: createdBy,
        path: path,
    });
    const notes = await Note.find({
        createdBy: createdBy,
        path: path,
    });

    const result = {
        folders,
        notes,
        count: { folders: folders.length, notes: notes.length },
    };
    return result;
};

module.exports = {
    getFilesAtPathByUser,
};
