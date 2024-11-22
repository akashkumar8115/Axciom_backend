const Book = require('../models/Book');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

class DataAnalyzer {
    async generateInsights() {
        const [bookStats, userStats, transactionStats] = await Promise.all([
            this.analyzeBooks(),
            this.analyzeUsers(),
            this.analyzeTransactions()
        ]);

        return {
            bookStats,
            userStats,
            transactionStats,
            timestamp: new Date()
        };
    }

    async analyzeBooks() {
        return await Book.aggregate([
            {
                $group: {
                    _id: '$genre',
                    totalBooks: { $sum: 1 },
                    averageAge: {
                        $avg: {
                            $subtract: [new Date().getFullYear(), '$publishYear']
                        }
                    }
                }
            }
        ]);
    }

    async analyzeUsers() {
        return await User.aggregate([
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
                    _id: 1,
                    activityLevel: { $size: '$transactions' },
                    membershipDuration: {
                        $dateDiff: {
                            startDate: '$createdAt',
                            endDate: '$$NOW',
                            unit: 'day'
                        }
                    }
                }
            }
        ]);
    }
}

module.exports = new DataAnalyzer();
