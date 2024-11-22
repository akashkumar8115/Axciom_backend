const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/auth');

router.get('/books', bookController.getAllBooks);
router.post('/books', authMiddleware.verifyToken, bookController.addBook);
router.put('/books/:id', authMiddleware.verifyToken, bookController.updateBook);
router.delete('/books/:id', authMiddleware.verifyToken, bookController.deleteBook);

module.exports = router;
