class MainController {
    constructor(server) {
        this.server = server;
        this.setupRoutes();
        this.initializeIntegrations();
    }

    setupRoutes() {
        // Core routes
        this.server.app.use('/api/books', require('../routes/bookRoutes'));
        this.server.app.use('/api/users', require('../routes/userRoutes'));
        this.server.app.use('/api/digital', require('../routes/digitalRoutes'));
        this.server.app.use('/api/ai', require('../routes/aiRoutes'));

        // Integration routes
        this.server.app.use('/api/realtime', require('../routes/realtimeRoutes'));
        this.server.app.use('/api/analytics', require('../routes/analyticsRoutes'));
    }

    async initializeIntegrations() {
        await Promise.all([
            this.server.orchestrator.initialize(),
            this.server.registry.initialize(),
            this.server.security.initialize()
        ]);
    }
}
