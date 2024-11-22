class KnowledgeGraphService {
    async buildKnowledgeGraph() {
        const books = await Book.find().populate('authors categories');
        const graph = new Graph();

        books.forEach(book => {
            this.addBookNode(graph, book);
            this.addRelationships(graph, book);
        });

        return {
            nodes: graph.getNodes(),
            edges: graph.getEdges(),
            metrics: this.calculateGraphMetrics(graph)
        };
    }

    async queryKnowledgeGraph(query) {
        const graphQuery = this.translateQuery(query);
        const results = await this.traverseGraph(graphQuery);

        return {
            directResults: results.direct,
            relatedConcepts: results.related,
            suggestedPaths: results.paths
        };
    }
}
