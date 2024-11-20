import brevo from '@getbrevo/brevo';
import twilio from 'twilio';
import { MercadoPagoConfig, Payment } from 'mercadopago';

/*Este es un health checker personalizado que es para verificar que los servicios de notificaciones estan funcionando bien  */

class NotificationServiceHealth {
    async checkBrevo() {
        try {
            const apiInstance = new brevo.TransactionalEmailsApi();
            apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
            await apiInstance.getAccount();
            
            return { status: 'healthy', lastChecked: new Date() };
        } catch (error) {
            return { status: 'unhealthy', error: error.message, lastChecked: new Date() };
        }
    }

    async checkTwilio() {
        try {
            const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
            
            return { status: 'healthy', lastChecked: new Date() };
        } catch (error) {
            return { status: 'unhealthy', error: error.message, lastChecked: new Date() };
        }
    }

    async checkMercadoPago() {
        try {
            const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
            const payment = new Payment(client);
            await payment.search();
            
            return { status: 'healthy', lastChecked: new Date() };
        } catch (error) {
            return { status: 'unhealthy', error: error.message, lastChecked: new Date() };
        }
    }

    async getStatus() {
        const [brevoStatus, twilioStatus, mpStatus] = await Promise.all([
            this.checkBrevo(),
            this.checkTwilio(),
            this.checkMercadoPago()
        ]);

        return {
            service: 'Notification Service',
            timestamp: new Date(),
            integrations: {
                brevo: brevoStatus,
                twilio: twilioStatus,
                mercadoPago: mpStatus
            },
            uptime: process.uptime()
        };
    }
}

export default new NotificationServiceHealth();
  

