class ServiceRegistry {
    constructor() {
        this.services = new Map();
        this.dependencies = new Map();
        this.status = new Map();
    }

    async registerService(name, service, dependencies = []) {
        this.services.set(name, service);
        this.dependencies.set(name, dependencies);
        await this.validateService(name);
        await this.startService(name);
    }

    async startService(name) {
        const service = this.services.get(name);
        const dependencies = this.dependencies.get(name);

        for (const dep of dependencies) {
            await this.ensureServiceRunning(dep);
        }

        await service.start();
        this.status.set(name, 'running');
    }
    async getService(serviceId) {
        const service = this.registry.get(serviceId);
        if (!service) throw new Error(`Service ${serviceId} not found`);
        return service;
    }
}
