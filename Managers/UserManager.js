const userStore = require('../Database/UserStore')
const hashService = require("../Services/HashService");

const getAllUsers = async (req, res) => {
    const users = await userStore.getAllUsers(res)
    if (users != null) {
        res.send(users.recordset);
    } else res.status(500).send("Something Went Wrong !!!");
};

const addUser = async (req, res) => {
    if (await userStore.isRegisteredUsername(req.query.Username)) {
        console.log("Creating User failed \"Username\" already exist!!");
        res.status(401).send("Creating User failed \"Username\" already exist!!");
        return
    }
    if (await userStore.addUser(req.query.Username, hashService.CreateHash(req.query.Password))) {
        res.send("User created!");
    } else res.status(500).send("Something Went Wrong !!!");
};

const deleteUser = async (req, res) => {
    if(await userStore.deleteUser(res, req.params.id)) res.send("User deleted!");
    else res.status(500).send("Something Went Wrong !!!");
};

module.exports = {getAllUsers, addUser, deleteUser};