const ServiceOrchestrator = require('../orchestrator/ServiceOrchestrator');
const SystemIntegrator = require('../integration/SystemIntegrator');
const config = require('../config/systemConfig');

async function initializeSystem() {
    // Initialize core components
    const orchestrator = new ServiceOrchestrator();
    const integrator = new SystemIntegrator(orchestrator);

    // Start all services
    await orchestrator.startServices();
    await integrator.setupIntegrations();

    // Initialize monitoring
    const monitoring = new SecurityMonitoringService();
    await monitoring.startMonitoring();

    return {
        orchestrator,
        integrator,
        monitoring
    };
}

module.exports = initializeSystem;
