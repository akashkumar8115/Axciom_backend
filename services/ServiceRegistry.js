class ServiceRegistry {
    constructor() {
        this.services = new Map()
        this.metadata = new Map()
    }

    register(name, service, metadata = {}) {
        this.services.set(name, service)
        this.metadata.set(name, {
            registeredAt: new Date(),
            status: 'active',
            ...metadata
        })
    }

    get(name) {
        return this.services.get(name)
    }

    getMetadata(name) {
        return this.metadata.get(name)
    }

    getAllServices() {
        return Array.from(this.services.entries()).map(([name, service]) => ({
            name,
            service,
            metadata: this.metadata.get(name)
        }))
    }

    deregister(name) {
        this.services.delete(name)
        this.metadata.delete(name)
    }

    hasService(name) {
        return this.services.has(name)
    }
}

module.exports = ServiceRegistry
