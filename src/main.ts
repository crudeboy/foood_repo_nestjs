import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // validation using pipes
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true, // flag extra parameters in the payload
            disableErrorMessages: process.env.NODE_ENV === 'PRODUCTION',
        }),
    );

    //getting the port from the environmental variables
    const configService = app.get(ConfigService);
    const port = configService.get("port")
    await app.listen(port);
}
bootstrap();
