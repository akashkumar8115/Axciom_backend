const Book = require('../models/Book');
const InventoryLog = require('../models/InventoryLog');

exports.updateInventory = async (req, res) => {
    try {
        const { bookId, action, quantity, reason } = req.body;
        const book = await Book.findById(bookId);

        const log = new InventoryLog({
            book: bookId,
            action,
            quantity,
            reason,
            performedBy: req.userId,
            previousQuantity: book.quantity
        });

        if (action === 'add') {
            book.quantity += quantity;
            book.available += quantity;
        } else if (action === 'remove') {
            book.quantity -= quantity;
            book.available = Math.max(0, book.available - quantity);
        }

        await book.save();
        await log.save();

        res.json({ book, log });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
