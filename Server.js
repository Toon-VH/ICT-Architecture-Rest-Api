const express = require('express');
const fileUpload = require('express-fileupload');
const fileRoutes = require('./Controllers/FileController');
const userRoutes = require('./Controllers/UserController');
const {AuthMiddleWare} = require("./Services/UserService");
const {LogMiddleWare} = require("./Services/LogService");

// add timestamps in front of log messages
require('console-stamp')(console, 'HH:MM:ss.l');

const app = express();
app.use(express.json());
app.use(fileUpload(undefined));
app.use(LogMiddleWare);
app.use(AuthMiddleWare);
app.use('/files', fileRoutes);
app.use('/users', userRoutes);


const server = app.listen(8081, () => {
    port = server.address().port
    console.log("Server running on address:https://127.0.0.1:%s", port)
});