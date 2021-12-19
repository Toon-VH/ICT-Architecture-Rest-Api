const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fileController = require('./Controllers/FileController');
const userController = require('./Controllers/UserController');
const logController = require('./Controllers/LogController');
const preSignedURLController = require('./Controllers/PreSignedURLController');
const {AuthMiddleWare} = require("./Services/UserService");
const {LogMiddleWare} = require("./Services/LogService");

// add timestamps in front of log messages
require('console-stamp')(console, 'HH:MM:ss.l');

console.log(process.version)

const app = express();
app.use(cors({
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))
app.use(express.json());
app.use(fileUpload(undefined));
app.use(LogMiddleWare);
app.use(AuthMiddleWare);

app.use('/PreURL',preSignedURLController)
app.use('/files', fileController);
app.use('/users', userController);
app.use('/logs', logController)


const server = app.listen(8080, () => {
    console.log("Server running on address:https://54.167.108.39:%s", server.address().port)
});