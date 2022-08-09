/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unresolved */
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schema/users.schema';
import { UsersService } from './users.service';
import { BcryptService } from './helpers/hashing.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(() => AuthModule), NotificationModule],
    providers: [UsersService, BcryptService],
    exports: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
