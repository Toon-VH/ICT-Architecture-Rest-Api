const UserDataBaseStore = require('../Database/UserStore');

async function AuthMiddleWare(req, res, next){
    if (!req.url.includes("/users/add")) {
        console.log("Checking authentication..");
        if (req.query.Password == null || req.query.Username == null) {
            console.log("Authentication failed no Username/Password given!!");
            res.status(401).send("Authentication failed no Username/Password given!!");
            return;

        } else if (!await UserDataBaseStore.isRegisteredUsername(req.query.Username)) {
            console.log("Authentication failed Username not found!!");
            res.status(401).send("Authentication failed Username not found!!");
            return;

        } else if (!await UserDataBaseStore.isAuthenticated(req.query.Username, req.query.Password)) {
            console.log("Authentication failed");
            res.status(401).send("Authentication failed wrong Username/Password !!");
            return;
        }
        console.log("Authentication successful!")
    }
    req.userId = await UserDataBaseStore.getUserId(req.query.Username);
    next();
}

module.exports = {AuthMiddleWare}