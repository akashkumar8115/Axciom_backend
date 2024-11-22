const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const SystemOrchestrator = require('./orchestrator/SystemOrchestrator')
const ServiceRegistry = require('./services/ServiceRegistry')
const SecurityCoordinator = require('./security/SecurityCoordinator')
const DigitalLibraryService = require('./services/DigitalLibraryService.js')
// const MembershipService = require('./services/MembershipService')
// const AnalyticsService = require('./services/AnalyticsService')
// const AIRecommendationEngine = require('./services/AIRecommendationEngine')
// const RealTimeCollaborationService = require('./services/RealTimeCollaborationService')
// const DataAnalyticsEngine = require('./services/DataAnalyticsEngine')
// const MessageBroker = require('./integrations/MessageBroker')
// const DataSynchronizer = require('./integrations/DataSynchronizer')
// const PerformanceOptimizer = require('./integrations/PerformanceOptimizer')
// const SecurityIntegrator = require('./integrations/SecurityIntegrator')
// const UserManagementService = require('./services/UserManagementService')
// const SystemUpdateService = require('./services/SystemUpdateService')
// const FeedbackService = require('./services/FeedbackService')
// const SystemLogService = require('./services/SystemLogService')

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/library_management', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

class Server {
    constructor() {
        this.app = express();
        this.orchestrator = new SystemOrchestrator();
        this.registry = new ServiceRegistry();
        this.security = new SecurityCoordinator();
        this.initialize();
    }

    setupMiddleware() {
        // Basic security middleware
        this.app.use(helmet())

        // CORS configuration
        this.app.use(cors({
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }))

        // Request parsing
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))

        // Logging
        this.app.use(morgan('dev'))

        // Authentication middleware
        this.app.use('/api', this.security.createAuthMiddleware())
    }
    async initialize() {
        await this.setupMiddleware();
        await this.orchestrator.initialize()
        await this.registerServices();
        await this.startSubsystems();

        // Register routes
        this.app.use('/api/auth', require('./routes/auth'))
        this.app.use('/api/books', require('./routes/books'))
        this.app.use('/api/members', require('./routes/members'))
        this.app.use('/api/reservations', require('./routes/reservations'))
        this.app.use('/api/digital-content', require('./routes/digitalContent'))
        this.app.use('/api/analytics', require('./routes/analytics'))
        this.app.use('/api/notifications', require('./routes/notifications'))
        this.app.use('/api/recommendations', require('./routes/recommendations'))
        this.app.use('/api/subscriptions', require('./routes/subscriptions'))
        this.app.use('/api/system-health', require('./routes/systemHealth'))
        this.app.use('/api/user-management', require('./routes/userManagement'))
        this.app.use('/api/system-updates', require('./routes/systemUpdates'))
        this.app.use('/api/feedback', require('./routes/feedback'))
        this.app.use('/api/system-logs', require('./routes/systemLogs'))
        this.app.use('/api/content-moderation', require('./routes/contentModeration'))
        // Start the server
        this.app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        });
    }



    async registerServices() {
        // Register all core services
        await this.registry.registerService(new DigitalLibraryService());
        await this.registry.registerService(new AIRecommendationEngine());
        await this.registry.registerService(new RealTimeCollaborationService());
        await this.registry.registerService(new DataAnalyticsEngine());
        // Register all integration services
        await this.registry.registerService(new MessageBroker());
        await this.registry.registerService(new DataSynchronizer());
        await this.registry.registerService(new PerformanceOptimizer());
        await this.registry.registerService(new SecurityIntegrator());
        await this.registry.registerService(new UserManagementService());
        await this.registry.registerService(new SystemUpdateService());
        await this.registry.registerService(new FeedbackService());
        await this.registry.registerService(new SystemLogService());
        // Register core services
        this.registry.register('digital', new DigitalLibraryService())
        this.registry.register('membership', new MembershipService())
        this.registry.register('analytics', new AnalyticsService())
    }
}

// const server = new Server();
// module.exports = server.app;
module.exports = Server