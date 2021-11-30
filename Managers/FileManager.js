const checksum = require('checksum');
const fileStore = require("../Database/FileStore")
const {v4: uuidv4} = require("uuid");
const bucketStore = require("../Database/BucketStore");
const logStore = require("../Database/LogStore");
const {getFileId} = require("../Database/FileStore");


//region OldMethodes
const getAllFiles = async (req, res) => {
    console.log("Getting all files..")
    const files = await fileStore.getAllFiles();
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
        if (await fileStore.uploadFile(file, cs, uuid)) {
            logStore.createLog('Upload', req.userId, await getFileId(uuid));
            console.log("File info saved and in db!")
            res.status(201).send("File uploaded to bucket/info saved and in db successfully!");
        }
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err);
    })
};


const downloadFile = async (req, res) => {
    if (req.params.uuid === undefined || req.params.uuid === null) {
        console.log("Downloading failed no UUID given!!");
        res.status(404).send("Downloading failed no UUID given!!");
        return;
    }
    console.log("Downloading file from bucket..")
    bucketStore.downloadFile(req.query.UUID).promise()
        .then(async result => {
            const newChecksum = checksum(result.Body.toString());
            const oldChecksum = await fileStore.getChecksum(req.query.UUID);
            console.log(newChecksum, oldChecksum);
            if (newChecksum === oldChecksum) {
                await logStore.createLog('Download', req.userId, await getFileId(req.query.UUID));
                res.write(result.Body, 'binary');
                res.end(null, 'binary');
                console.log("Downloading successful!")
            } else {
                res.status().send("Checksum doesn't match file corrupted!")
            }
        })
        .catch(err => {
            if (err.code === 'NoSuchKey') {
                res.status(404).send("Requested file does not exist!");
                console.log("Requested file does not exist!")
                return;
            }
            console.log(err);
            res.status(500).send("Something Went Wrong !!!");
        });
};

const deleteFile = async (req, res) => {
    if (req.params.uuid === undefined || req.params.uuid === null) {
        console.log("Deleting failed no UUID given!!");
        res.status(404).send("Deleting failed no UUID given!!");
        return;
    }
    console.log("Deleting file..");
    const fileId = await fileStore.getFileId(req.query.uuid)
    if (await fileStore.deleteFile(req.query.uuid)) {
        bucketStore.deleteFile(req.query.uuid).promise().then(async () => {
            logStore.createLog('Delete', req.userId, fileId);
            console.log("File deleted")
            res.send("File deleted!");
        }).catch((err) => {
            res.status(500).send("Something Went Wrong !!!");
            console.log(err)
        });
    }
}
//endregion


//region NewMethodes
const signalUploadComplete = async (req, res) => {
    if (req.params.uuid === undefined || req.params.uuid === null) {
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
    if (await fileStore.uploadFile(file, cs, uuid)) {
        await logStore.createLog('Upload', req.userId, await getFileId(uuid));
        console.log("File info saved and in db!")
        res.status(201).send("Info saved and in DB successfully!");
    }

}

const signalDownloadComplete = async (req, res) => {


}

//endregion

module.exports = {getAllFiles, downloadFile, uploadFile, deleteFile, signalUploadComplete, signalDownloadComplete};