const mongoose = require("mongoose");

const Folder = require("./folder.model");

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

const createFolder = async ({
    folderName,
    folderColor,
    folderTags,
    folderPathString,
    createdBy,
}) => {
    const folderPath = folderPathString.split("/");

    // Folder path exists
    const validFolderPath = await doesFolderWithPathAndNameExists({
        folderPath: folderPath.slice(0, folderPath.length - 1),
        folderName: folderPath[[folderPath.length - 1]],
        createdBy: createdBy,
    });
    if (!(folderPath.length === 1 || validFolderPath))
        return { msg: "Folder Doesnt Exists" };

    // Duplicate folder check
    const duplicateFolder = await doesFolderWithPathAndNameExists({
        folderPath,
        folderName,
        createdBy: createdBy,
    });
    if (duplicateFolder) return { msg: "Folder Already Exists" };

    // Insert
    const folder = await Folder.create({
        name: folderName,
        color: folderColor,
        tags: folderTags,
        path: folderPath,
        createdBy: createdBy,
    });
    return { folder };
};

const updateFolder = async ({
    folderID,
    updateType,
    newFolderName,
    newFolderColor,
    newFolderTags,
    newFolderPathString,
    createdBy,
}) => {
    const folder = await Folder.findOne({
        _id: folderID,
        createdBy: createdBy,
    });

    if (!folder)
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ msg: "Folder not Found" });

    // Color Update
    if (updateType === "color") {
        const newFolderData = await Folder.findOneAndUpdate(
            { _id: folderID, createdBy: createdBy },
            { $set: { color: newFolderColor } },
            { new: true, runValidators: true }
        );
        return { msg: "Updated", newFolderData };
    }

    // Tags Update
    if (updateType === "tags") {
        const newFolderData = await Folder.findOneAndUpdate(
            { _id: folderID, createdBy: createdBy },
            { $set: { tags: newFolderTags } },
            { new: true, runValidators: true }
        );
        return { msg: "Updated", newFolderData };
    }

    // Name update
    if (updateType === "name") {
        // Update Child Folders
        let subfolder = 0;
        let matchObj = {};
        matchObj[`path.${folder.path.length}`] = newFolderName;

        await Folder.aggregate()
            .project({
                slicedPath: { $slice: ["$path", folder.path.length + 1] },
                createdBy: 1,
            })
            .match({
                slicedPath: [...folder.path, folder.name],
                createdBy: mongoose.Types.ObjectId(createdBy),
            })
            .cursor({ batchSize: 100 })
            .eachAsync(async (doc, i) => {
                subfolder = i;
                await Folder.findByIdAndUpdate(
                    doc._id,
                    { $set: matchObj },
                    { new: true, runValidators: true }
                );
            });

        // Update Current Folder
        const newFolder = await Folder.findByIdAndUpdate(
            folderID,
            { $set: { name: newFolderName } },
            { new: true, runValidators: true }
        );

        return { msg: "Updated", newFolder, subfolder: subfolder + 1 };
    }

    return { msg: "Wrong folder update type" };
};

const deleteFolder = async ({ folderID, createdBy }) => {
    const folder = await Folder.findOne({
        _id: folderID,
        createdBy: createdBy,
    });
    if (!folder)
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ msg: "Folder not Found" });

    // Delete Child Folders
    let subfolder = 0;
    await Folder.aggregate()
        .project({
            slicedPath: { $slice: ["$path", folder.path.length + 1] },
            createdBy: 1,
        })
        .match({
            slicedPath: [...folder.path, folder.name],
            createdBy: mongoose.Types.ObjectId(createdBy),
        })
        .cursor({ batchSize: 100 })
        .eachAsync(async (doc, i) => {
            subfolder = i;
            await Folder.findByIdAndDelete(doc._id);
        });

    // Delete Current Folder
    await Folder.findByIdAndDelete(folderID);

    return { msg: "Deleted", subfolder: subfolder + 1 };
};

module.exports = {
    doesFolderWithPathAndNameExists,
    createFolder,
    updateFolder,
    deleteFolder,
};
