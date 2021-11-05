const sql = require("mssql");
const dbConfig = require('../Database/dbConnection');
const hashService = require("../Services/HashService");

const getAllUsers = (req, res) => {
    sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query("SELECT * FROM Users;");
    }).then(result => {
        res.send(result.recordset);
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err)
    })
};

const addUser = (req, res) => {
    sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`
                INSERT INTO [NodeJS-API-Test].dbo.Users (UserName, HashPassword)
                VALUES ('${req.query.Username}', '${hashService.CreateHash(req.query.Password)}');
                        `);
    }).then(() => {
        res.send("Add successful!");
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err)
    })
};

const deleteUser = (req, res) => {
    res.json({message: "POST new file"});
};


module.exports = {getAllUsers,addUser,deleteUser};