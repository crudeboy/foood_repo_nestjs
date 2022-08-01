import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb+srv://delemacdele:ia4uTe9HSMEgWEAu@cluster0.87q96.mongodb.net/?retryWrites=true&w=majority')
    // MongooseModule.forRoot('mongodb+srv://delemacdele:ia4uTe9HSMEgWEAu@cluster0.87q96.mongodb.net/?retryWrites=true&w=majority')
    MongooseModule.forRoot('mongodb://localhost/food_api'),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
