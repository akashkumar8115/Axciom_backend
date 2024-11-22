class MaintenanceService {
    async performDatabaseMaintenance() {
        await this.cleanupOldSessions();
        await this.optimizeIndexes();
        await this.archiveOldRecords();
        await this.validateDataIntegrity();
    }

    async cleanupOldSessions() {
        const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        await Session.deleteMany({ lastAccessed: { $lt: oneMonthAgo } });
    }

    async optimizeIndexes() {
        const collections = await mongoose.connection.db.collections();
        for (const collection of collections) {
            await collection.reIndex();
        }
    }

    async archiveOldRecords() {
        const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
        const oldTransactions = await Transaction.find({
            status: 'completed',
            completedAt: { $lt: sixMonthsAgo }
        });

        await Archive.insertMany(oldTransactions);
        await Transaction.deleteMany({
            status: 'completed',
            completedAt: { $lt: sixMonthsAgo }
        });
    }
}

module.exports = new MaintenanceService();
