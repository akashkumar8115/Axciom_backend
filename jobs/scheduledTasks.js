const cron = require('node-cron');
const fineController = require('../controllers/fineController');
const logger = require('../utils/logger');

const initScheduledJobs = () => {
    // Calculate fines daily at midnight
    cron.schedule('0 0 * * *', async () => {
        try {
            await fineController.calculateFines();
            logger.info('Daily fine calculation completed');
        } catch (error) {
            logger.error('Fine calculation failed:', error);
        }
    });

    // Weekly backup at 1 AM on Sunday
    cron.schedule('0 1 * * 0', async () => {
        try {
            // Backup logic here
            logger.info('Weekly backup completed');
        } catch (error) {
            logger.error('Backup failed:', error);
        }
    });
};

module.exports = initScheduledJobs;
