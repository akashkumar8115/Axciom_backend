const Book = require('../models/Book');
const cacheService = require('./cacheService');

class SearchService {
    async searchBooks(query) {
        const cacheKey = `search:${JSON.stringify(query)}`;
        const cachedResults = await cacheService.get(cacheKey);

        if (cachedResults) {
            return cachedResults;
        }

        const searchQuery = this.buildSearchQuery(query);
        const results = await Book.find(searchQuery)
            .populate('author')
            .limit(20);

        await cacheService.set(cacheKey, results);
        return results;
    }

    buildSearchQuery(query) {
        const { keyword, genre, year, available } = query;
        let searchQuery = {};

        if (keyword) {
            searchQuery.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { 'author.name': { $regex: keyword, $options: 'i' } }
            ];
        }

        if (genre) searchQuery.genre = genre;
        if (year) searchQuery.publishYear = year;
        if (available) searchQuery.available = { $gt: 0 };

        return searchQuery;
    }
}

module.exports = new SearchService();
