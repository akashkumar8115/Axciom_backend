const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

class RecommendationService {
    async getPersonalizedRecommendations(userId) {
        const userHistory = await this.getUserReadingHistory(userId);
        const preferences = this.analyzePreferences(userHistory);
        return await this.findSimilarBooks(preferences);
    }

    async getUserReadingHistory(userId) {
        return await Transaction.find({ user: userId })
            .populate('book')
            .sort('-borrowDate')
            .limit(20);
    }

    analyzePreferences(history) {
        const preferences = {
            genres: {},
            authors: {},
            periods: {}
        };

        history.forEach(transaction => {
            const book = transaction.book;
            preferences.genres[book.genre] = (preferences.genres[book.genre] || 0) + 1;
            preferences.authors[book.author] = (preferences.authors[book.author] || 0) + 1;
            preferences.periods[Math.floor(book.publishYear / 10) * 10] =
                (preferences.periods[Math.floor(book.publishYear / 10) * 10] || 0) + 1;
        });

        return preferences;
    }

    async findSimilarBooks(preferences) {
        const topGenres = Object.entries(preferences.genres)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([genre]) => genre);

        return await Book.find({
            genre: { $in: topGenres },
            available: { $gt: 0 }
        })
            .limit(10)
            .sort('-rating');
    }
}

module.exports = new RecommendationService();
