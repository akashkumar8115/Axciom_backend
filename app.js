const express = require('express');
const SystemBootstrap = require('./integration/SystemBootstrap');
const SystemCoordinator = require('./integration/SystemCoordinator');
const config = require('./config/systemConfig');

class Application {
    constructor() {
        this.app = express();
        this.coordinator = new SystemCoordinator();
    }

    async start() {
        // Initialize system
        await SystemBootstrap.initializeSystem();

        // Start coordination
        await this.coordinator.coordinate();

        // Start HTTP server
        this.app.listen(config.port, () => {
            console.log(`Library System running on port ${config.port}`);
        });
    }
}

const application = new Application();
application.start();
