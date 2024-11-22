class AuditService {
    async logAction(action) {
        const auditLog = new AuditLog({
            action: action.type,
            user: action.userId,
            details: action.details,
            timestamp: new Date(),
            ipAddress: action.ipAddress,
            userAgent: action.userAgent
        });

        await auditLog.save();
        await this.checkForSuspiciousActivity(action);
    }

    async checkForSuspiciousActivity(action) {
        const recentActions = await AuditLog.find({
            user: action.userId,
            timestamp: {
                $gte: new Date(Date.now() - 5 * 60 * 1000)
            }
        });

        if (recentActions.length > 20) {
            await securityService.flagSuspiciousActivity(action.userId);
        }
    }
}

module.exports = new AuditService();
