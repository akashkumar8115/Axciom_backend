class SystemMonitor {
    constructor(registry) {
        this.registry = registry;
        this.metrics = new MetricsCollector();
        this.alerts = new AlertManager();
    }

    async monitorSystem() {
        const services = this.registry.getAllServices();

        for (const [name, service] of services) {
            const health = await this.checkServiceHealth(service);
            const metrics = await this.collectServiceMetrics(service);

            await this.updateServiceStatus(name, health);
            await this.storeMetrics(name, metrics);
        }
    }

    async checkServiceHealth(service) {
        try {
            const status = await service.healthCheck();
            const performance = await service.getPerformanceMetrics();
            return { status, performance };
        } catch (error) {
            await this.alerts.raiseAlert('service_health', error);
            return { status: 'error', error };
        }
    }
}
