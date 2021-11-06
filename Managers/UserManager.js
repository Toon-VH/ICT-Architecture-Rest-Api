const sql = require("mssql");
const dbConfig = require('../Database/DataBaseConnection');
const UserService = require('../Services/UserService')

const getAllUsers = (req, res) => {
    console.log("Getting all users..")
    sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query("SELECT * FROM Users;");
    }).then(result => {
        console.log("All users retrieved successfully!")
        res.send(result.recordset);
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err)
    })
};

const addUser = async (req, res) => {
    console.log("Creating User..")
    if (await UserService.IsRegisteredUsername(req.query.Username)) {
        console.log("Creating User failed \"Username\" already exist!!");
        res.status(401).send("Creating User failed \"Username\" already exist!!");
        return
    }
    sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`
                INSERT INTO [NodeJS-API-Test].dbo.Users (UserName, HashPassword)
                VALUES ('${req.query.Username}', '${hashService.CreateHash(req.query.Password)}');
                        `);
    }).then(() => {
        console.log("User created!")
        res.send("User created!");
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err)
    })
};

const deleteUser = (req, res) => {
    console.log("Deleting user..")
    sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`DELETE FROM Users WHERE Id = ${req.params.id}`);
    }).then(() => {
        console.log("User deleted")
        res.send("User deleted!");
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err)
    })
};

module.exports = {getAllUsers,addUser, deleteUser};