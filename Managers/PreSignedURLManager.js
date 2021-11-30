const {v4: uuidv4} = require("uuid");
const bucketStore = require("../Database/BucketStore");

const getPutPresignedURL =  async (req, res) => {
    const uuid = uuidv4();
    console.log("UUID Created: ",{uuid});
    console.log("Creating PreSignedURL")
    res.json(bucketStore.GeneratePutURL(uuid));
    console.log("PreSignedURL sent!!")
}

const getGetPresignedURl =  async (req, res) => {
    console.log("Creating PreSignedURL")
    res.json(bucketStore.GenerateGetURL(req.query.UUID));
    console.log("PreSignedURL sent!!")
}

module.exports = {getPutPresignedURL, getGetPresignedURl}