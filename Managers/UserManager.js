const userStore = require('../Database/UserStore')
const hashService = require("../Services/HashService");

const getAllUsers = (req, res) => {
    userStore.getAllUsers(res);
};

const addUser = async (req, res) => {
    if (await userStore.isRegisteredUsername(req.query.Username)) {
        console.log("Creating User failed \"Username\" already exist!!");
        res.status(401).send("Creating User failed \"Username\" already exist!!");
        return
    }
    userStore.addUser(res, req.query.Username, hashService.CreateHash(req.query.Password))
};

const deleteUser = (req, res) => {
    userStore.deleteUser(res, req.params.id)
};

module.exports = {getAllUsers,addUser, deleteUser};