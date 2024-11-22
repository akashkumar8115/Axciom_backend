const request = require('supertest');
const app = require('../../server');
const Book = require('../../models/Book');
const mongoose = require('mongoose');

describe('Book API', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.TEST_MONGODB_URI);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('GET /api/books', () => {
        it('should return all books', async () => {
            const response = await request(app).get('/api/books');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });
});
