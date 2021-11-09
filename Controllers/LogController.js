const express = require('express');
const router  = express.Router();
const LogManager = require('../Managers/LogManager');

router.get('/', LogManager.getAllLogs);

module.exports = router;