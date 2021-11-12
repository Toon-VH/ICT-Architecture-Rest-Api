const sql = require("mssql");
const dbConfig = require("../Database/DataBaseConnection");

const getAllLogs = () => {
    return sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query("SELECT * FROM Logs;");
    }).then(result => {
        return result.recordset;
    }).catch(err => {
        console.log(err)
        return null;
    })
}

const createLog = (action, userId, fileId) => {
    return sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`
                    INSERT INTO Logs (Action, UserId, Time, FileId)
                    VALUES ('${action}', ${userId}, GETDATE(), ${fileId})`);
    }).then(() => {
        return true;
    }).catch(err => {
        console.error(err);
        return false;
    })
}

module.exports = {getAllLogs, createLog}