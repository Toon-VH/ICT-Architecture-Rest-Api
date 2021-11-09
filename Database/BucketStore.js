const {S3, SharedIniFileCredentials} = require('aws-sdk');

const credentials = new SharedIniFileCredentials({profile: 'default'})
const S3Client = new S3({
    region: 'us-east-1',
    credentials,
});


// const AWS = require('aws-sdk');
//
// const myConfig = new AWS.Config({
//     region: 'us-east-1', apiVersion: '2006-03-01'
// });
//
// s3 = new AWS.S3(myConfig);

S3Client.listBuckets(function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data.Buckets);
    }
});

const uploadFile = (file, uuid) =>{
    const params = {
        Bucket: 'tvh-bucket',
        Key: uuid,
        Body: file.data
    };
    S3Client.upload(params, (s3Err, data) => {
        if (s3Err) throw s3Err
        console.log(`File uploaded successfully at ${data.Location}`)
    });
};

const downloadFile = (file, uuid) =>{
    const params = {
        Bucket: 'tvh-bucket',
        Key: uuid
    };
    return S3Client.getObject(params).createReadStream();
};

module.exports = {uploadFile, downloadFile}

