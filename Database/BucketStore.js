const AWS = require('aws-sdk');

const myConfig = new AWS.Config({
    region: 'us-east-1', apiVersion: '2006-03-01'
});

s3 = new AWS.S3(myConfig);

// Call S3 to list the buckets
s3.listBuckets(function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data.Buckets);
    }
});

const UploadFileToBucket = (file,fileName) =>{
    const params = {
        Bucket: 'tvh-bucket', // pass your bucket name
        Key: fileName, // file will be saved as testBucket/contacts.csv
        Body: JSON.stringify(file, null, 2)
    };
    s3.upload(params, function(s3Err, data) {
        if (s3Err) throw s3Err
        console.log(`File uploaded successfully at ${data.Location}`)
    });
};

module.exports = {UploadFileToBucket}

