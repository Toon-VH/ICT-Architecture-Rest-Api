const express = require('express');
const router  = express.Router();
const FileManager = require('../Managers/FileManager');

router.get('/', FileManager.getAllFiles);
router.get('/download', FileManager.downloadFile);
router.post('/upload', FileManager.uploadFile);
router.delete('/delete', FileManager.deleteFile);

module.exports = router;