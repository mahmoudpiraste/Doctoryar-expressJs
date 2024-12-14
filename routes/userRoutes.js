const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/users', authMiddleware.authenticate, userController.getUsers);

module.exports = router;
