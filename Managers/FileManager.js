const checksum = require('checksum');
const fileDataBaseStore = require("../Database/FileStore")
const {v4: uuidv4} = require("uuid");
const {uploadFileToBucket} = require("../Database/BucketStore");


const getAllFiles = (req, res) => {
    fileDataBaseStore.getAllFiles(res);
};

const downloadFile = (req, res) => {
    fileDataBaseStore.downloadFile(res);
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
    fileDataBaseStore.uploadFile(res,file,cs);
    uploadFileToBucket(file, uuid);
};

const deleteFile = (req, res) => {
    fileDataBaseStore.deletingFile(res,req.params.id);
};

module.exports = {getAllFiles, downloadFile, uploadFile, deleteFile};