const os = require('os');
const mongoose = require('mongoose');

class HealthCheck {
    async checkSystem() {
        return {
            uptime: process.uptime(),
            memory: {
                total: os.totalmem(),
                free: os.freemem(),
                used: os.totalmem() - os.freemem()
            },
            cpu: os.cpus(),
            loadAverage: os.loadavg()
        };
    }

    async checkDatabase() {
        try {
            await mongoose.connection.db.admin().ping();
            return {
                status: 'connected',
                latency: await this.measureDbLatency()
            };
        } catch (error) {
            return {
                status: 'disconnected',
                error: error.message
            };
        }
    }

    async measureDbLatency() {
        const start = Date.now();
        await mongoose.connection.db.admin().ping();
        return Date.now() - start;
    }
}

module.exports = new HealthCheck();
