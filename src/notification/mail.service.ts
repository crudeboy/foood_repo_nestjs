import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';
import { IMail, IOTPInfo, MailInput } from './interfaces/mail.interface';
import axios from 'axios';
import { threadId } from 'worker_threads';

@Injectable()
export class MailService {
    logger: Logger;

    constructor(private mailerService: MailerService, private configService: ConfigService) {
        this.logger = new Logger(MailService.name);
    }

    async sendOtp(username: string, email: string, otp: number) {
        await this.mailerService.sendMail({
            to: email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Welcome to Foolilicious!!! Confirm your Email',
            template: './otp.mail.hbs', // `.hbs` extension is appended automatically
            context: {
                // ✏️ filling curly brackets with content
                username,
                otp,
            },
        });
        return 'successful';
    }

    public async sendOTPMail(otp_info: IOTPInfo) {
        try {
            const otp_mail_variables = {
                to: otp_info.email,
                subject: 'Your OTP Mail',
                template: 'otp.mail',
                text: '',
                templateVariables: {
                    username: otp_info.username,
                    otp: otp_info.otp,
                },
            };
            const send_otp = await this.sendMail(otp_mail_variables);
            Logger.log(`OTP Email successfully sent to: ${otp_info.email}.`);

        } catch (error) {
            Logger.warn(`Problem in sending email: ${error}`);
            throw error;
        }
    }

    public async sendMail(mail: IMail) {
        const mailOptions: MailInput = {
            from: `The Foodie group <${this.configService.get('SENDER_EMAIL')}>`,
            to: mail.to,
            subject: mail.subject,
        };
        if (mail.template) {
            const emailTemplateSource = fs.readFileSync(path.join(__dirname, `./templates/${mail.template}.hbs`), 'utf8');
            const template = handlebars.compile(emailTemplateSource);
            const htmlToSend = template(mail.templateVariables);
            mailOptions.html = htmlToSend;
        } else {
            mailOptions.text = mail.text;
        }
        try {
            const body = Object.keys(mailOptions)
                .map((key, index) => `${key}=${encodeURIComponent(mailOptions[key])}`)
                .join('&');
            const response = await axios.post(`https://api.mailgun.net/v3/${this.configService.get('MAILGUN_DOMAIN')}/messages`, body, {
                auth: {
                    username: 'api',
                    password: this.configService.get('MAILGUN_API_KEY'),
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            Logger.log(`Email successfully sent to: ${mail.to}.`);
            return response;
        } catch (error) {
            Logger.warn(`Problem in sending email: ${error}`);
            throw error;
        }
    }
}
