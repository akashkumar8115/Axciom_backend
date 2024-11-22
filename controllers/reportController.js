const Book = require('../models/Book');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.generateReport = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.body;
        let report = {};

        switch (type) {
            case 'circulation':
                report = await Transaction.aggregate([
                    {
                        $match: {
                            borrowDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
                        }
                    },
                    {
                        $group: {
                            _id: '$book',
                            totalBorrows: { $sum: 1 }
                        }
                    }
                ]);
                break;

            case 'inventory':
                report = await Book.aggregate([
                    {
                        $group: {
                            _id: '$genre',
                            totalBooks: { $sum: '$quantity' },
                            availableBooks: { $sum: '$available' }
                        }
                    }
                ]);
                break;

            case 'user':
                report = await User.aggregate([
                    {
                        $lookup: {
                            from: 'transactions',
                            localField: '_id',
                            foreignField: 'user',
                            as: 'transactions'
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            email: 1,
                            totalTransactions: { $size: '$transactions' }
                        }
                    }
                ]);
                break;
        }

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
