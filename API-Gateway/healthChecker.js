const axios = require('axios');

// Health Checker para todos los servicios
class HealthChecker {
    constructor(services, interval) {
        this.services = services;
        this.interval = interval || 30000;
        this.statuses = {};
    }

    start() {
        console.log('Starting health checks...');
        this.checkServices();
        setInterval(() => this.checkServices(), this.interval);
    }

    async checkServices() {
        for (const service of this.services) {
            try {
                const response = await axios.get(service.url);
                this.statuses[service.name] = {
                    status: 'healthy',
                    httpStatus: response.status,
                    lastChecked: new Date().toISOString(),
                };
                console.log(`Health check for ${service.name}: Status ${response.status}`);
            } catch (error) {
                this.statuses[service.name] = {
                    status: 'unhealthy',
                    httpStatus: error.response ? error.response.status : 500,
                    lastChecked: new Date().toISOString(),
                    error: error.message,
                };
            }
        }
    }

    async getNotificationServiceDetails() {
        try {
            const notificationResponse = await axios.get('http://localhost:3003/health');
            
            return {
                service: 'Notification Service',
                timestamp: new Date().toISOString(),
                uptime: notificationResponse.data.uptime
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                lastChecked: new Date().toISOString(),
            };
        }
    }

    getStatuses() {
        return this.statuses;
    }
}

module.exports = HealthChecker;