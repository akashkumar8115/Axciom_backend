class IntegrationService {
    constructor() {
        this.integrations = new Map();
        this.loadIntegrations();
    }

    async loadIntegrations() {
        const integrationConfigs = await IntegrationConfig.find({ active: true });
        for (const config of integrationConfigs) {
            this.integrations.set(config.name, {
                handler: require(`../integrations/${config.name}`),
                config: config.settings
            });
        }
    }

    async executeIntegration(name, data) {
        const integration = this.integrations.get(name);
        if (!integration) {
            throw new Error(`Integration ${name} not found`);
        }

        try {
            return await integration.handler.execute(data, integration.config);
        } catch (error) {
            logger.error(`Integration ${name} failed:`, error);
            throw error;
        }
    }
}

module.exports = new IntegrationService();
