const express = require('express');
const router  = express.Router();
const UserController = require('../Managers/UserManager');

router.get('/', UserController.getAllUsers);
router.post('/add', UserController.addUser);
router.delete('/delete/:id', UserController.deleteUser);

module.exports = router;