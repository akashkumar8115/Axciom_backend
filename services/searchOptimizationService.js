class SearchOptimizationService {
    constructor() {
        this.searchIndex = new ElasticSearchClient({
            node: process.env.ELASTICSEARCH_URL
        });
    }

    async indexDocument(document) {
        const indexedDoc = await this.searchIndex.index({
            index: 'library',
            body: {
                id: document._id,
                title: document.title,
                content: document.content,
                tags: document.tags,
                vector: await this.generateEmbedding(document.content)
            }
        });

        return indexedDoc;
    }

    async semanticSearch(query) {
        const queryVector = await this.generateEmbedding(query);

        const results = await this.searchIndex.search({
            index: 'library',
            body: {
                query: {
                    script_score: {
                        query: { match_all: {} },
                        script: {
                            source: "cosineSimilarity(params.query_vector, 'vector') + 1.0",
                            params: { query_vector: queryVector }
                        }
                    }
                }
            }
        });

        return results.hits.hits;
    }
}
