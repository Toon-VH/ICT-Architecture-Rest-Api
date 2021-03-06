const sql = require("mssql");
const dbConfig = require("../Database/DataBaseConnection");

const getAllFiles = () => {
    return sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query("SELECT * FROM Files;");
    }).then(result => {
        return result.recordset;
    }).catch(err => {
        console.log(err)
        return null;
    })
}

const uploadFileInfo = (cs, uuid) => {
    return sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`
                INSERT INTO Files (UUID, Checksum)
                VALUES ('${uuid}', '${cs}');
                `);
    }).then(() => {
        return true
    }).catch(err => {
        console.log(err)
        return false
    })
}

const deleteFileInfo = (uuid) => {
    return sql.connect(dbConfig.dbConnection).then(() => {
        sql.query(`DELETE FROM Files WHERE UUID = '${uuid}'`);
    }).then(() => {
        return true
    }).catch(err => {
        console.log(err)
        return false
    })
}

const getFileId = (uuid) => {
    return sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`SELECT Id FROM Files WHERE UUID = '${uuid}';`);
    }).then(result => {
        return result.recordset[0].Id;
    }).catch((err) => {
        console.log(err);
        return false;
    })
}

const getChecksum = async (uuid) => {
    return sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`SELECT Checksum FROM Files WHERE UUID = '${uuid}';`);
    }).then(result => {
        return result.recordset[0].Checksum;
    }).catch((err) => {
        console.log(err);
        return false;
    })
}


module.exports = {getAllFiles, uploadFileInfo, deleteFileInfo, getFileId ,getChecksum}




