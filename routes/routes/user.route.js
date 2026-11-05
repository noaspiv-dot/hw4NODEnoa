const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getAllUsers);
router.post('/sign-up', userController.signUp);
router.post('/sign-in', userController.signIn);

module.exports = router;
