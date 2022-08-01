import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
 
@Module({

  imports: [
    UsersModule,
    PassportModule, 
    JwtModule.register({
      secret: 'secretKey', //move to env
      signOptions: { expiresIn: '1d'}
    })],
    // forwardRef(() => UsersModule)],
    providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
