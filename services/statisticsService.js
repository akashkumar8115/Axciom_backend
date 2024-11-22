class StatisticsService {
    async generateSystemStats() {
        const [
            totalBooks,
            activeUsers,
            currentBorrowings,
            overdueBorrowings
        ] = await Promise.all([
            Book.countDocuments(),
            User.countDocuments({ status: 'active' }),
            Transaction.countDocuments({ status: 'active' }),
            Transaction.countDocuments({
                status: 'active',
                dueDate: { $lt: new Date() }
            })
        ]);

        const popularBooks = await Transaction.aggregate([
            {
                $group: {
                    _id: '$book',
                    borrowCount: { $sum: 1 }
                }
            },
            { $sort: { borrowCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'bookDetails'
                }
            }
        ]);

        return {
            totalBooks,
            activeUsers,
            currentBorrowings,
            overdueBorrowings,
            popularBooks,
            timestamp: new Date()
        };
    }
}
