const express = require('express');
const router  = express.Router();
const FileController = require('../Managers/FileManager');

router.get('/', FileController.getAllFiles);
router.get('/download', FileController.downloadFile);
router.post('/upload', FileController.uploadFile);

module.exports = router;