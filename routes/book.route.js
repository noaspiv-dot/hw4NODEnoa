const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');

router.get('/', bookController.getAllBooks);
router.get('/:code', bookController.getBookByCode);
router.post('/', bookController.addBook);
router.put('/:code', bookController.updateBook);
router.patch('/:code/borrow', bookController.borrowBook);
router.patch('/:code/return', bookController.returnBook);
router.delete('/:code', bookController.deleteBook);

module.exports = router;