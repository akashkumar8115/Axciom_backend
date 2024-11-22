const Joi = require('joi');

const bookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    isbn: Joi.string().pattern(/^[\d-]{10,13}$/).required(),
    genre: Joi.string().required(),
    publishYear: Joi.number().integer().min(1000).max(new Date().getFullYear()),
    quantity: Joi.number().integer().min(0)
});

const validateBook = (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {
    validateBook
};
