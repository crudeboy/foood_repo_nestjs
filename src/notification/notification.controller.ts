import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { MailService } from './mail.service';

@Controller('notification')
export class NotificationController {
    constructor(private mailService: MailService) {}
    @Post('/send-mail')
    async sign_up(@Req() req: Request, @Res() res: Response) {
        await this.mailService.sendMail({
            to: 'olopopowill@gmail.com',
            subject: 'tetsting testing',
            template: 'otp.mail',
            text: 'Na we dey here',
            templateVariables: {
                username: 'bode',
                otp: 1234,
            },
        });
        res.send('i am here');
    }
}
