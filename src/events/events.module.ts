import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from 'src/notification/notification.module';
import { EventsService } from './events.service';

@Module({
    imports: [EventEmitterModule.forRoot(), NotificationModule],
    providers: [EventsService],
    exports: [EventsService],
})
export class EventsModule {}
