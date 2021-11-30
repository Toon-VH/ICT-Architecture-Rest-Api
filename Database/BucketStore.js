const {S3, SharedIniFileCredentials} = require('aws-sdk');

const credentials = new SharedIniFileCredentials({profile: 'default'})

const S3Client = new S3({
    region: 'us-east-1',
    credentials,
});

const AWS = require('aws-sdk');

const myConfig = new AWS.Config({
    region: 'us-east-1', apiVersion: '2006-03-01'
});

s3 = new AWS.S3(myConfig);


S3Client.listBuckets(function(err, data) {
    console.log("Finding Buckets..")
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data.Buckets);
    }
});

const uploadFile = (file, uuid) => {
    const params = {
        Bucket: 'tvh-bucket',
        Key: uuid,
        Body: file.data
    };
    return S3Client.upload(params);
};

const downloadFile = (uuid) =>{
    const params = {
        Bucket: 'tvh-bucket',
        Key: uuid
    };
    return S3Client.getObject(params);
};

const deleteFile = (uuid) =>{
    const params = {
        Bucket: 'tvh-bucket',
        Key: uuid
    };
    return S3Client.deleteObject(params);
}


const GeneratePutURL= (uuid)=>{
    const params = {
        Bucket: 'tvh-bucket',
        Key: uuid,
        Expires: 900
    };

    return S3Client.getSignedUrl('putObject', params)
}

const GenerateGetURL= (uuid)=>{
    const params = {
        Bucket: 'tvh-bucket',
        Key: uuid,
        Expires: 900
    };

    return S3Client.getSignedUrl('getObject', params)
}


module.exports = {uploadFile, downloadFile, deleteFile, GeneratePutURL, GenerateGetURL}

