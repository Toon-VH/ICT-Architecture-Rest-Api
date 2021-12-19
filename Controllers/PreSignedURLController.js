const express = require('express');
const router  = express.Router();
const PresignedURLManager = require('../Managers/PreSignedURLManager');

router.get('/put', PresignedURLManager.getPutPresignedURL);
router.get('/get', PresignedURLManager.getGetPresignedURl);

module.exports = router;