class CircuitBreaker {
    constructor(service) {
        this.service = service;
        this.state = 'CLOSED';
        this.failures = 0;
        this.lastFailure = null;
        this.thresholds = this.getThresholds();
    }

    async executeCall(request) {
        if (this.isOpen()) {
            if (this.shouldAttemptReset()) {
                return await this.attemptReset(request);
            }
            throw new Error('Circuit breaker is open');
        }

        try {
            const result = await this.service.execute(request);
            this.recordSuccess();
            return result;
        } catch (error) {
            this.recordFailure(error);
            throw error;
        }
    }
}
