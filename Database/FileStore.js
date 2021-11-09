const sql = require("mssql");
const dbConfig = require("../Database/DataBaseConnection");

const getAllFiles = () => {
    return  sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query("SELECT * FROM Files;");
    }).then(result => {
        return result.recordset;
    }).catch(err => {
        console.log(err)
        return null;
    })
}

const uploadFile = (file, cs, uuid) => {
   return  sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`
                INSERT INTO Files (UUID, Checksum,Name)
                VALUES ('${uuid}', '${cs}','${file.name}');
                `);
    }).then(() => {
       return true
    }).catch(err => {
        console.log(err)
        return false
    })
}

const deletingFile = (id) => {
    return sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`DELETE FROM Files WHERE Id = ${id}`);
    }).then(() => {
        return true
    }).catch(err => {
        console.log(err)
        return false
    })
}

module.exports = {getAllFiles, uploadFile, deletingFile}




