const Fine = require('../models/Fine');
const Transaction = require('../models/Transaction');
const emailService = require('../services/emailService');

exports.calculateFines = async () => {
    const overdueBorrowings = await Transaction.find({
        status: 'active',
        dueDate: { $lt: new Date() }
    }).populate('user');

    for (const transaction of overdueBorrowings) {
        const daysOverdue = Math.floor((Date.now() - transaction.dueDate) / (1000 * 60 * 60 * 24));
        const fineAmount = daysOverdue * 0.50; // $0.50 per day

        const fine = new Fine({
            user: transaction.user._id,
            transaction: transaction._id,
            amount: fineAmount,
            reason: `Overdue by ${daysOverdue} days`
        });

        await fine.save();
        await emailService.sendEmail(
            transaction.user.email,
            'overdue_notice',
            {
                userName: transaction.user.name,
                bookTitle: transaction.book.title,
                daysOverdue,
                fineAmount
            }
        );
    }
};
