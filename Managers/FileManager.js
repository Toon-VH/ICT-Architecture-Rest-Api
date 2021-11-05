const sql = require("mssql");
const dbConfig = require('../Database/dbConnection');
const {v4: uuidv4} = require('uuid');
const checksum = require('checksum');
const hashService = require("../Services/HashService");

const getAllFiles = (req, res) => {
    sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query("SELECT * FROM Files;");
    }).then(result => {
        res.send(result.recordset);
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err)
    })
};

const downloadFile = (req, res) => {
    console.log("Checking Authentication")
    if (!IsAuthenticated(req.query.Username, req.query.Password))
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
    console.log("Checking Authentication");
    if (req.query.Password == null || req.query.Username == null) {
        console.log("Authentication failed no Username/Password given!!");
        res.status(401).send("Authentication failed no Username/Password given!!");
        return

    }else if (!await IsRegisteredUsername(req.query.Username)) {
        console.log("Authentication failed Username not found!!");
        res.status(401).send("Authentication failed Username not found!!");
        return

    } else if (!await IsAuthenticated(req.query.Username, req.query.Password)) {
        console.log("Authentication failed");
        res.status(401).send("Authentication failed wrong Username/Password !!");
        return
    }

    console.log("Authentication successful!")
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
    }).then(result => {
        res.send(result);
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err)
    })
    console.log(`File uploaded.`);
};

function IsRegisteredUsername(username){
    return sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`SELECT UserName FROM Users WHERE UserName = '${username.toString()}';`);
    }).then(result => {
        return (result.recordset[0] != null)
    }).catch(err => {
        console.log(err);
    })
}

function IsAuthenticated(username, password) {
    return sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`SELECT HashPassword FROM Users WHERE UserName = '${username.toString()}';`);
    }).then(result => {
        let hash = hashService.CreateHash(password)
        return (result.recordset[0].HashPassword === hash)
    }).catch(err => {
        console.log(err);
    })
}


module.exports = {getAllFiles,downloadFile,uploadFile};