const AWS = require('aws-sdk');

const myConfig = new AWS.Config({
    region: 'us-east-1', apiVersion: '2006-03-01'
});

s3 = new AWS.S3(myConfig);

// s3.listBuckets(function(err, data) {
//     if (err) {
//         console.log("Error", err);
//     } else {
//         console.log("Success", data.Buckets);
//     }
// });

const uploadFile = (file, uuid) =>{
    const params = {
        Bucket: 'tvh-bucket',
        Key: uuid,
        Body: file.data
    };
    s3.upload(params, (s3Err, data) => {
        if (s3Err) throw s3Err
        console.log(`File uploaded successfully at ${data.Location}`)
    });
};

const downloadFile = (file, uuid) =>{
    const params = {
        Bucket: 'tvh-bucket',
        Key: uuid
    };
    return s3.getObject(params).createReadStream();
};

module.exports = {uploadFile, downloadFile}

