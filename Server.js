const express = require('express');
const fileUpload = require('express-fileupload');
const fileRoutes = require('./Controllers/FileController');
const userRoutes = require('./Controllers/UserController');

const app = express();

app.use(express.json());
app.use('/files', fileRoutes);
app.use('/users', userRoutes);
app.use(fileUpload(undefined));

const server = app.listen(8081, () => {
    port = server.address().port
    console.log("Server running on address:https://127.0.0.1:%s", port)
});

