import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { NotificationController } from './notification.controller';

@Module({
    imports: [
        MailerModule.forRootAsync({
            // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
            // or
            useFactory: async (config: ConfigService) => ({
                // transport: config.get("MAIL_TRANSPORT"),
                // or
                transport: {
                    host: config.get('MAIL_HOST'),
                    secure: false,
                    // port: 465,
                    auth: {
                        // type: 'OAuth2',
                        // user: config.get('MAIL_USER'),
                        // serviceClient: process.env.MAIL_CLIENT_ID,
                        // privateKey: process.env.MAIL_PRIVATE_KEY.replace(/\\n/g, '\n'),
                        user: config.get('MAIL_USER'),
                        pass: config.get('MAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: `"No Reply" <${config.get('MAIL_FROM')}>`,
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [MailService],
    exports: [MailService],
    controllers: [NotificationController],
})
export class NotificationModule {}
