const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    genre: {
        type: String,
        required: true
    },
    publishYear: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    available: {
        type: Number,
        default: 1
    },
    location: {
        shelf: String,
        row: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Book', bookSchema);
