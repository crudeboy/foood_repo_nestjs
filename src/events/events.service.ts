import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { IOTPInfo } from 'src/notification/interfaces/mail.interface';
import { MailService } from 'src/notification/mail.service';

@Injectable()
export class EventsService {

    constructor(private eventEmitter: EventEmitter2, private mailService: MailService
        ){}

    emitEvent() {
        this.eventEmitter.emit('msg.sent', 'Hello World')
    }

    @OnEvent('msg.sent')
    listentToEvent(send_otp_mail: IOTPInfo) {
        console.log('Message Received: ', send_otp_mail)
    }

    emitOTPEmailEvent(send_otp_mail: IOTPInfo){
        this.eventEmitter.emit('send_otp_event', send_otp_mail)
    }

    @OnEvent('send_otp_event')
    async listentToOtpMail(send_otp_mail: IOTPInfo) {
        await this.mailService.sendOTPMail(send_otp_mail)
        setTimeout(() =>{
            console.log("testing the synchronous nature of events.")
        }, 6000) // this confirms that the evnt is asynchronous it does not wait for the response from the evnt b4 the resposne is given
    }
}
