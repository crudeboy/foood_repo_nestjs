import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Response, Request } from 'express'
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('users')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard) 
  @Post("/login")
  async login(@Req() req: Request): Promise<any> {
    const user = this.authService.login(req.user)
    return user
  }

  @UseGuards(JwtAuthGuard)
  @Post("/addPictures") 
  async addMenuPics(@Req() req: Request){
    return req.user
  }
}


