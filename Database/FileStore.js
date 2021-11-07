const sql = require("mssql");
const dbConfig = require("../Database/DataBaseConnection");

const getAllFiles = (res) => {
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
}

const uploadFile = (res, file, cs, uuid) => {
    console.log(`Saving file info/Uploading file..`);
    sql.connect(dbConfig.dbConnection).then(() => {
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
}

const downloadFile = (res) => {
    console.log(`Downloading file..`);
    sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query("SELECT * FROM Files;");
    }).then(result => {
        res.send(result.recordset);
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err)
    })
}

const deletingFile = (res, id) => {
    console.log("Deleting file..");
    sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`DELETE FROM Files WHERE Id = ${id}`);
    }).then(() => {
        console.log("File deleted")
        res.send("File deleted!");
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err)
    })
}

module.exports = {getAllFiles, uploadFile, downloadFile, deletingFile}




