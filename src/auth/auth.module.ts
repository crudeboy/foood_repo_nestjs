import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { Otp, OtpSchema } from './schema/otp.schema';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
    imports: [
        // forwardRef(() => UsersModule),
        MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
        PassportModule,
        UsersModule,
        
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secretOrPrivateKey: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRATION_DUARATION'),
                },
              }),
              inject: [ConfigService],
        }),
        ConfigModule
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, OtpService],
    exports: [OtpService, AuthService],
})
export class AuthModule {}
