class SystemIntegrator {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.eventBus = new EventStreamingService();
        this.setupIntegrations();
    }

    async setupIntegrations() {
        // Connect all services
        await this.connectCoreServices();
        await this.setupEventHandlers();
        await this.initializeDataStreams();
    }

    async connectCoreServices() {
        const services = this.orchestrator.getServices();

        for (const [name, service] of services) {
            await this.registerServiceEvents(name, service);
            await this.setupServiceDependencies(service);
        }
    }
}
