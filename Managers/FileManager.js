const checksum = require('checksum');
const fileDataBaseStore = require("../Database/FileStore")
const {v4: uuidv4} = require("uuid");
const bucketStore = require("../Database/BucketStore");

const getAllFiles = async (req, res) => {
    console.log("Getting all files..")
    const files = await fileDataBaseStore.getAllFiles();
    if (files !== null) {
        console.log("All files retrieved successfully!")
        res.send(files);
    } else res.status(500).send("Something Went Wrong !!!");
};

const uploadFile = async (req, res) => {
    if (req.files === undefined || req.files === null) {
        console.log("Uploading failed no file given!!");
        res.status(404).send("Uploading failed no file given!!");
        return;
    }
    const uuid = uuidv4();
    console.log({uuid});
    const file = req.files[''];
    const cs = checksum(file.data.toString());
    console.log(`Making Checksum: ${cs}`);
    console.log(`Saving file info/Uploading file..`);
    if (await fileDataBaseStore.uploadFile(file, cs, uuid)) {
        console.log("file info saved in database!")
        res.send("file info saved in database!");
        bucketStore.uploadFile(file, uuid);
    }else res.status(500).send("Something Went Wrong !!!");
};

const downloadFile = (req, res) => {

};

const deleteFile = async (req, res) => {
    console.log("Deleting file..");
    if ( await fileDataBaseStore.deletingFile(req.params.id)){
        console.log("File deleted")
        res.send("File deleted!");
    }else res.status(500).send("Something Went Wrong !!!");

};

module.exports = {getAllFiles, downloadFile, uploadFile, deleteFile};