class DataBackupService {
    async performBackup(type = 'full') {
        const backupStrategies = {
            full: this.fullBackup.bind(this),
            incremental: this.incrementalBackup.bind(this),
            differential: this.differentialBackup.bind(this)
        };

        const backup = await backupStrategies[type]();
        await this.encryptBackup(backup);
        await this.uploadToCloud(backup);

        return {
            backupId: backup.id,
            timestamp: backup.timestamp,
            size: backup.size,
            checksum: backup.checksum
        };
    }

    async restoreFromBackup(backupId) {
        const backup = await this.downloadFromCloud(backupId);
        await this.verifyBackupIntegrity(backup);
        await this.decryptBackup(backup);

        return await this.performRestore(backup);
    }
}
