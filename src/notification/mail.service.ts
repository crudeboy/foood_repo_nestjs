import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

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
        return "successful"
    }
}
