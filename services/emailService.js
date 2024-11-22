const nodemailer = require('nodemailer');
const EmailTemplate = require('../models/EmailTemplate');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendEmail(to, templateName, data) {
        try {
            const template = await EmailTemplate.findOne({ name: templateName });
            const content = this.compileTemplate(template.content, data);

            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to,
                subject: template.subject,
                html: content
            });

            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }

    compileTemplate(template, data) {
        return template.replace(/\${(\w+)}/g, (match, key) => data[key] || '');
    }
}

module.exports = new EmailService();
