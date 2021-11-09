const checksum = require('checksum');
const fileDataBaseStore = require("../Database/FileStore")
const {v4: uuidv4} = require("uuid");
const bucketStore = require("../Database/BucketStore");
const logStore = require("../Database/LogStore");

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
    console.log(`Uploading file to bucket/Saving file info in db..`);
    bucketStore.uploadFile(file, uuid).promise().then(async (data) => {
        console.log(`File uploaded successfully at ${data.Location}`)
        if (await fileDataBaseStore.uploadFile(file, cs, uuid)) {
            logStore.createLog('Upload', uuid, req.userId);
            console.log("File info saved and in db!")
            res.status(201).send("File uploaded to bucket/info saved and in db successfully!");
        }
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err);
    })
};

const downloadFile = async (req, res) => {
    console.log("Downloading file from bucket..")
     bucketStore.downloadFile(req.query.UUID).promise()
        .then(result => {
            logStore.createLog('Download', req.query.UUID, req.userId);
            res.write(result.Body,'binary');
            res.end(null, 'binary');
            console.log("Downloading successful!")
        })
        .catch(err => {
            console.log(err);
            if (err.code === 'NoSuchKey') {
                res.status(204).send("Requested file does not exist.")
                return;
            }
            res.status(500).send("Something Went Wrong !!!");
        });
};

const deleteFile = async (req, res) => {
    console.log("Deleting file..");
    if (await fileDataBaseStore.deleteFile(req.query.uuid)) {
        bucketStore.deleteFile(req.query.uuid).promise().then(() => {
            logStore.createLog('Delete', req.query.UUID, req.userId);
            console.log("File deleted")
            res.send("File deleted!");
        }).catch((err) => {
            res.status(500).send("Something Went Wrong !!!");
            console.log(err)
        });
    }
}
module.exports = {getAllFiles, downloadFile, uploadFile, deleteFile};