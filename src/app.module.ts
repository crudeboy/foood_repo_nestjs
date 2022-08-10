/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unresolved */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NotificationModule } from './notification/notification.module';
import { LoggerMiddleware } from './utils/logger.middleware';
import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './utils/http-error.filter';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                uri: config.get('ENVIRONMENT') === 'development' ? config.get('MONGO_LOCAL_DB') : config.get('MONGO_DB_DEVELOPMENT'),
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        UsersModule,
        NotificationModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpErrorFilter,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
