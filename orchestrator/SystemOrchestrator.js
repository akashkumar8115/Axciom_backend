const EventEmitter = require('events')

class SystemOrchestrator {
    constructor() {
        this.services = new Map()
        this.eventBus = new EventEmitter()
        this.isInitialized = false
    }

    registerService(name, service) {
        this.services.set(name, service)
    }

    async initialize() {
        try {
            for (const [name, service] of this.services) {
                if (typeof service.initialize === 'function') {
                    await service.initialize()
                }
            }
            this.isInitialized = true
            this.eventBus.emit('system:ready')
        } catch (error) {
            this.eventBus.emit('system:error', error)
            throw error
        }
    }

    getService(name) {
        return this.services.get(name)
    }

    async shutdown() {
        for (const [name, service] of this.services) {
            if (typeof service.shutdown === 'function') {
                await service.shutdown()
            }
        }
        this.eventBus.removeAllListeners()
        this.isInitialized = false
    }
}

module.exports = SystemOrchestrator