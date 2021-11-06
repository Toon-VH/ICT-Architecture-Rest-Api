const sql = require("mssql");
const dbConfig = require('../Database/dbConnection');
const {v4: uuidv4} = require('uuid');
const checksum = require('checksum');
const UserService = require('../Services/UserService')


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


    const file = req.files[''].data;
    const cs = checksum(file.toString());
    console.log(`Making Checksum: ${cs}`);
    console.log(`Uploading file..`);

    sql.connect(dbConfig.dbConnection).then(() => {
        const uuid = uuidv4();
        console.log({uuid})
        return sql.query(`
                INSERT INTO Files (UUID, Checksum)
                VALUES ('${uuid}', '${cs}');
                `);
    }).then(() => {
        console.log("file uploaded!")
        res.send().message("file uploaded!");
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