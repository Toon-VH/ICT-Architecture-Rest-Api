const checksum = require('checksum');
const fileStore = require("../Database/FileStore")
const bucketStore = require("../Database/BucketStore");
const logStore = require("../Database/LogStore");
const {getFileId} = require("../Database/FileStore");
//const async = require("async"); // To call AWS operations asynchronously.

const getAllFiles = async (req, res) => {
    console.log("Getting all files..")
    const files = await fileStore.getAllFiles();
    if (files !== null) {
        console.log("All files retrieved successfully!")
        res.send(files);
    } else res.status(500).send("Something Went Wrong !!!");
};

const signalUploadComplete = async (req, res) => {
    if (req.query.UUID === undefined || req.query.UUID === null) {
        console.log("Signal failed no UUID given!!");
        res.status(404).send("Signal failed no UUID given!!");
        return;
    }
    const uuid = req.query.UUID
    console.log("Downloading file from bucket..")
    let file = await bucketStore.downloadFile(uuid);
    const cs = checksum(file.toString());
    console.log(`Making Checksum: ${cs}`);
    console.log(`Saving file info in db..`);
    if (await fileStore.uploadFileInfo(file.name, cs, uuid)) {
        await logStore.createLog('Upload', req.userId, await getFileId(uuid));
        console.log("File info saved and in db!")
        res.status(201).send("Info saved and in DB successfully!");
    }

}

const signalDownloadComplete = async (req, res) => {
    if (req.query.UUID === undefined || req.query.UUID === null) {
        console.log("Signal failed no UUID given!!");
        res.status(404).send("Signal failed no UUID given!!");
        return;
    }
    const uuid = req.query.UUID
    await logStore.createLog('Download', req.userId, await getFileId(uuid));
    console.log("File info saved and in db!")
    res.status(201).send("Info saved and in DB successfully!");
}


module.exports = {getAllFiles, signalUploadComplete, signalDownloadComplete};