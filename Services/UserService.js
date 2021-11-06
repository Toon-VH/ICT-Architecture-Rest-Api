const sql = require("mssql");
const dbConfig = require("../Database/DataBaseConnection");
const hashService = require("../Services/HashService");

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

const GetUserId = (username) => {
    return sql.connect(dbConfig.dbConnection).then(() => {
        return sql.query(`SELECT Id FROM Users WHERE UserName = '${username.toString()}';`);
    }).then(result => {
        return result
    }).catch(err => {
        console.log(err);
    })
}



async function AuthMiddleWare(req, res, next){
    if (!req.url.includes("/users/add")) {
        console.log("Checking authentication..");
        if (req.query.Password == null || req.query.Username == null) {
            console.log("Authentication failed no Username/Password given!!");
            res.status(401).send("Authentication failed no Username/Password given!!");
            return;

        } else if (!await IsRegisteredUsername(req.query.Username)) {
            console.log("Authentication failed Username not found!!");
            res.status(401).send("Authentication failed Username not found!!");
            return;

        } else if (!await IsAuthenticated(req.query.Username, req.query.Password)) {
            console.log("Authentication failed");
            res.status(401).send("Authentication failed wrong Username/Password !!");
            return;
        }
        console.log("Authentication successful!")
    }
    next();
}

module.exports = {AuthMiddleWare,IsRegisteredUsername,GetUserId}