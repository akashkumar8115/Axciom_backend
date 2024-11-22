class VirtualAssistantService {
    async processQuery(query, context) {
        const intent = await this.detectIntent(query);
        const entities = await this.extractEntities(query);

        const response = await this.generateResponse(intent, entities, context);
        await this.learnFromInteraction(query, response, context);

        return {
            response,
            suggestedActions: await this.getSuggestedActions(intent, context),
            relatedResources: await this.findRelatedResources(entities)
        };
    }

    async generateResponse(intent, entities, context) {
        const template = await ResponseTemplate.findOne({ intent });
        return this.fillTemplate(template, { entities, context });
    }
}
