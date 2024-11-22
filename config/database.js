const mongoose = require('mongoose');

const dbConfig = {
    connect: async () => {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            });
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Database connection failed:', error);
            process.exit(1);
        }
    }
};

module.exports = dbConfig;
