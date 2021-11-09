const express = require('express');
const fileUpload = require('express-fileupload');
const fileController = require('./Controllers/FileController');
const userController = require('./Controllers/UserController');
const logController = require('./Controllers/LogController');
const {AuthMiddleWare} = require("./Services/UserService");
const {LogMiddleWare} = require("./Services/LogService");

// add timestamps in front of log messages
require('console-stamp')(console, 'HH:MM:ss.l');

const app = express();
app.use(express.json());
app.use(fileUpload(undefined));
app.use(LogMiddleWare);
app.use(AuthMiddleWare);
app.use('/files', fileController);
app.use('/users', userController);
app.use('/logs', logController)


const server = app.listen(8081, () => {
    console.log("Server running on address:https://127.0.0.1:%s", server.address().port)
});