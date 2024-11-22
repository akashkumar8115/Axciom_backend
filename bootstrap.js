const Server = require('./server');
const config = require('./config/systemConfig');

async function bootstrap() {
    try {
        // Initialize core systems
        const mainServer = new Server();
        await mainServer.initialize();

        // Start all subsystems
        const subsystems = [
            new DistributedCache(),
            new TransactionManager(),
            new ResourceScheduler(),
            new SystemState(),
            new FaultToleranceManager(),
            new MetricsAggregator()
        ];

        await Promise.all(subsystems.map(system => system.start()));

        console.log('Library Management System started successfully');
        return mainServer;
    } catch (error) {
        console.error('System startup failed:', error);
        process.exit(1);
    }
}

bootstrap();
