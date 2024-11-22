const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../utils/logger');

class BackupService {
    constructor() {
        this.backupDir = path.join(__dirname, '../backups');
    }

    async createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `backup-${timestamp}.gz`;
        const filepath = path.join(this.backupDir, filename);

        try {
            await this.ensureBackupDir();
            await this.executeBackup(filepath);
            await this.uploadToCloud(filepath);
            return { success: true, filename };
        } catch (error) {
            logger.error('Backup failed:', error);
            throw error;
        }
    }

    async ensureBackupDir() {
        try {
            await fs.mkdir(this.backupDir, { recursive: true });
        } catch (error) {
            logger.error('Failed to create backup directory:', error);
            throw error;
        }
    }

    async executeBackup(filepath) {
        return new Promise((resolve, reject) => {
            exec(
                `mongodump --uri="${process.env.MONGODB_URI}" --gzip --archive=${filepath}`,
                (error, stdout, stderr) => {
                    if (error) reject(error);
                    else resolve(stdout);
                }
            );
        });
    }
}

module.exports = new BackupService();
