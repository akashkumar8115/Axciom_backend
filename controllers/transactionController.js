const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');

exports.borrowBook = async (req, res) => {
    try {
        const { bookId } = req.body;
        const book = await Book.findById(bookId);
        if (!book || book.available < 1) {
            return res.status(400).json({ message: 'Book not available' });
        }

        const transaction = new Transaction({
            user: req.userId,
            book: bookId,
            type: 'borrow',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
        });

        await transaction.save();
        book.available -= 1;
        await book.save();

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.returnBook = async (req, res) => {
    try {
        const { transactionId } = req.body;
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        transaction.returnDate = new Date();
        transaction.status = 'returned';
        await transaction.save();

        const book = await Book.findById(transaction.book);
        book.available += 1;
        await book.save();

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
