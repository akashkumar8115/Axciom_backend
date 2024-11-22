const EventEmitter = require('events');

class LibraryEventEmitter extends EventEmitter {
    constructor() {
        super();
        this.registerHandlers();
    }

    registerHandlers() {
        this.on('book:borrowed', async (data) => {
            await notificationService.sendNotification(data.userId, 'BORROW_CONFIRMATION');
            await statisticsService.updateBorrowStats(data.bookId);
        });

        this.on('book:returned', async (data) => {
            await notificationService.sendNotification(data.userId, 'RETURN_CONFIRMATION');
            await inventoryService.updateBookStatus(data.bookId, 'available');
        });

        this.on('fine:created', async (data) => {
            await notificationService.sendNotification(data.userId, 'FINE_NOTIFICATION');
        });
    }
}

module.exports = new LibraryEventEmitter();
