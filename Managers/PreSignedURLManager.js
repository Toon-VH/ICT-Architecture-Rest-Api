const {v4: uuidv4} = require("uuid");
const bucketStore = require("../Database/BucketStore");
const fileStore = require("../Database/FileStore");

const getPutPresignedURL =  async (req, res) => {
    const uuid = uuidv4();
    console.log("UUID Created: ",{uuid});
    console.log("Creating PreSignedURL")
    res.json(bucketStore.GeneratePutURL(uuid));
    console.log("PreSignedURL sent!!")
}

const getGetPresignedURl =  async (req, res) => {
    console.log("Creating PreSignedURL")
    const cs = await fileStore.getChecksum(req.query.UUID);
    const presignedURL = bucketStore.GenerateGetURL(req.query.UUID);
    const json = {"presignedURL": presignedURL, "cs": cs}
    res.json(json);
    console.log("PreSignedURL sent!!")
}

module.exports = {getPutPresignedURL, getGetPresignedURl}