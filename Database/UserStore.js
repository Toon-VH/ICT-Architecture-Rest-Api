const sql = require("mssql");
const dbConfig = require("../Database/DataBaseConnection");
const hashService = require("../Services/HashService");

const getAllUsers = (res) => {
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
}

const addUser = (res, userName, hash) => {
    console.log("Creating User..")
    sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`
                INSERT INTO Users (UserName, HashPassword)
                VALUES ('${userName}', '${hash}');
                        `);
    }).then(() => {
        console.log("User created!")
        res.send("User created!");
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err)
    })
}

const deleteUser = (res, id) => {
    console.log("Deleting user..")
    sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`DELETE FROM Users WHERE Id = ${id}`);
    }).then(() => {
        console.log("User deleted")
        res.send("User deleted!");
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
        console.log(err)
    })
}

const isRegisteredUsername = (username) => {
    return sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`SELECT UserName FROM Users WHERE UserName = '${username.toString()}';`);
    }).then(result => {
        return (result.recordset[0] != null)
    }).catch(err => {
        console.log(err);
    })
}

const isAuthenticated = (username, password) => sql.connect(dbConfig.dbConnection).then(() => {
    return sql.query(`SELECT HashPassword FROM Users WHERE UserName = '${username.toString()}';`);
}).then(result => {
    let hash = hashService.CreateHash(password)
    return (result.recordset[0].HashPassword === hash)
}).catch(err => {
    console.log(err);
});

//todo: test
const getUserId = (username) => {
    return sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`SELECT Id FROM Users WHERE UserName = '${username.toString()}';`);
    }).then(result => {
        return result
    }).catch(err => {
        console.log(err);
    })
}

module.exports = {getAllUsers, addUser, deleteUser, isRegisteredUsername, isAuthenticated, getUserId};