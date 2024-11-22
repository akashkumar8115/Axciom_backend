class ServiceContainer {
    constructor() {
        this.services = new Map();
        this.dependencies = new DependencyResolver();
        this.lifecycle = new ServiceLifecycle();
    }

    async registerServices() {
        // Core Services
        await this.register('library', new LibraryService());
        await this.register('digital', new DigitalService());
        await this.register('ai', new AIService());
        await this.register('analytics', new AnalyticsService());

        // Integration Services
        await this.register('realtime', new RealtimeService());
        await this.register('search', new SearchService());
        await this.register('notification', new NotificationService());
    }

    async startServices() {
        const order = this.dependencies.resolveStartupOrder();
        for (const serviceName of order) {
            await this.lifecycle.startService(this.services.get(serviceName));
        }
    }
}
