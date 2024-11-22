const promClient = require('prom-client');

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5]
});

const activeUsers = new promClient.Gauge({
    name: 'library_active_users',
    help: 'Number of active users in the system'
});

register.registerMetric(httpRequestDuration);
register.registerMetric(activeUsers);

module.exports = {
    register,
    httpRequestDuration,
    activeUsers
};
