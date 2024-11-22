const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

exports.getAnalytics = async (req, res) => {
    try {
        const bookAnalytics = await Transaction.aggregate([
            {
                $group: {
                    _id: '$book',
                    borrowCount: { $sum: 1 },
                    averageDuration: {
                        $avg: {
                            $subtract: ['$returnDate', '$borrowDate']
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'bookDetails'
                }
            }
        ]);

        const userAnalytics = await Transaction.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m',
                            date: '$borrowDate'
                        }
                    },
                    activeUsers: { $addToSet: '$user' },
                    totalTransactions: { $sum: 1 }
                }
            },
            {
                $project: {
                    month: '$_id',
                    activeUsers: { $size: '$activeUsers' },
                    totalTransactions: 1
                }
            },
            { $sort: { month: 1 } }
        ]);

        res.json({ bookAnalytics, userAnalytics });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
