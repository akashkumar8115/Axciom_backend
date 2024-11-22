const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');
const reportController = require('../controllers/reportController');

router.post('/notifications', verifyToken, notificationController.sendNotification);
router.post('/reports', verifyToken, isAdmin, reportController.generateReport);

// Advanced search routes
router.post('/search', async (req, res) => {
    try {
        const { keyword, filters, sort } = req.body;
        const query = {
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { author: { $regex: keyword, $options: 'i' } },
                { isbn: { $regex: keyword, $options: 'i' } }
            ]
        };

        if (filters.genre.length) query.genre = { $in: filters.genre };
        if (filters.language.length) query.language = { $in: filters.language };
        if (filters.publishYear) query.publishYear = filters.publishYear;

        const sortOptions = {
            relevance: { score: { $meta: 'textScore' } },
            title: { title: 1 },
            author: { author: 1 },
            year: { publishYear: -1 },
            popularity: { borrowCount: -1 }
        };

        const books = await Book.find(query).sort(sortOptions[sort]);
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
