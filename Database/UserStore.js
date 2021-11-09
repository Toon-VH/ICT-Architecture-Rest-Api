const sql = require("mssql");
const dbConfig = require("../Database/DataBaseConnection");
const hashService = require("../Services/HashService");

const getAllUsers =  () => {
    console.log("Getting all users..")
    return sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query("SELECT * FROM Users;");
    }).then(result => {
        console.log("All users retrieved successfully!")
        return result.recordset
    }).catch(err => {
        console.log(err)
        return null
    })
}

const addUser = (userName, hash) => {
    console.log("Creating User..")
    return sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`
                INSERT INTO Users (UserName, HashPassword)
                VALUES ('${userName}', '${hash}');
                        `);
    }).then(() => {
        console.log("User created!")
        return true
    }).catch(err => {
        console.log(err)
        return false
    })
}

const deleteUser = (res, id) => {
    console.log("Deleting user..")
    return sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`DELETE FROM Users WHERE Id = ${id}`);
    }).then(() => {
        console.log("User deleted")
        return true
    }).catch(err => {
        console.log(err)
        return true
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


const getUserId = (username) => {
    return sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`SELECT Id FROM Users WHERE UserName = '${username.toString()}';`);
    }).then(result => {
        return result.recordset[0].Id
    }).catch(err => {
        console.log(err);
    })
}

module.exports = {getAllUsers, addUser, deleteUser, isRegisteredUsername, isAuthenticated, getUserId};