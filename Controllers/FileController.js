const express = require('express');
const router  = express.Router();
const FileManager = require('../Managers/FileManager');


router.post('/signalUploadComplete', FileManager.signalUploadComplete);
router.post('/signalDownloadComplete', FileManager.signalDownloadComplete);
router.get('/', FileManager.getAllFiles);

module.exports = router;