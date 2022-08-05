import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.init();
    // validation using pipes
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true, // flag extra parameters in the payload
            disableErrorMessages: process.env.NODE_ENV === 'PRODUCTION',
        }),
    );

    //configuring the use of the configuration service to get env variables
    const configService = app.get(ConfigService);
    const porrt = parseInt(configService.get('port'));
    await app.listen(porrt);
}
bootstrap();
