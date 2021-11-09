const express = require('express');
const router  = express.Router();
const UserManager = require('../Managers/UserManager');

router.get('/', UserManager.getAllUsers);
router.post('/add', UserManager.addUser);
router.delete('/delete/:id', UserManager.deleteUser);

module.exports = router;