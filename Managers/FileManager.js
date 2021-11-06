const sql = require("mssql");
const dbConfig = require('../Database/DataBaseConnection');
const {v4: uuidv4} = require('uuid');
const checksum = require('checksum');
const UserService = require('../Services/UserService')
const {UploadFileToBucket} = require("../Database/BucketStore");


const getAllFiles = (req, res) => {
    console.log("Getting all files..")
    sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query("SELECT * FROM Files;");
    }).then(result => {
        console.log("All files retrieved successfully!")
        res.send(result.recordset);
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err)
    })
};

const downloadFile = (req, res) => {
    console.log("Checking authentication..")
    if (!UserService.IsAuthenticated(req.query.Username, req.query.Password))
        console.log("Authentication successful!")
    console.log(`Downloading file..`);
    sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query("SELECT * FROM Files;");
    }).then(result => {
        res.send(result.recordset);
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err)
    })
};

const uploadFile = async (req, res) => {

    if (req.files === undefined || req.files === null){
        console.log("Uploading failed no file given!!");
        res.status(404).send("Uploading failed no file given!!");
        return;
    }
    const file = req.files[''];
    const cs = checksum(file.data.toString());
    console.log(`Making Checksum: ${cs}`);
    console.log(`Saving file info/Uploading file..`);
    sql.connect(dbConfig.dbConnection).then(() => {
        const uuid = uuidv4();
        console.log({uuid})
        UploadFileToBucket(file,file.name);
        return sql.query(`
                INSERT INTO Files (UUID, Checksum,Name)
                VALUES ('${uuid}', '${cs}','${file.name}');
                `);
    }).then(() => {
        console.log("file info saved in database!")
        res.send("file info saved in database!");
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err)
    })
};

const deleteFile = (req, res) => {
    console.log("Deleting file..")
    sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`DELETE FROM Files WHERE Id = ${req.params.id}`);
    }).then(() => {
        console.log("File deleted")
        res.send("File deleted!");
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err)
    })
};

module.exports = {getAllFiles,downloadFile,uploadFile,deleteFile};