const axios = require("axios");

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
                    status: 'UP',
                    httpStatus: response.status,
                    lastChecked: new Date()
                };
                console.log(`Health check for ${service.name}: Status ${response.status}`);
            } catch (error) {
                this.statuses[service.name] = {
                    status: 'DOWN',
                    error: error.message,
                    lastChecked: new Date()
                };
                console.log(`Health check for ${service.name} failed: ${error.message}`);
            }
        }
    }

    getStatuses() {
        return this.statuses;
    }
}

// Definición de los servicios a monitorear
const services = [
    { name: 'User Service', url: 'http://localhost:3002/health' },
    { name: 'Notification Service', url: 'http://localhost:3003/health' }
];

const checker = new HealthChecker(services, 60000); // 1 minuto

checker.start();

module.exports = checker;
