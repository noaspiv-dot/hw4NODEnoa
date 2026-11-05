const express = require('express');
const router = express.Router();

const bookRoutes = require('./book.route');
const userRoutes = require('./user.route');

router.use('/books', bookRoutes);
router.use('/users', userRoutes);

module.exports = router;
