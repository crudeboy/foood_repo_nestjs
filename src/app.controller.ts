import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Response, Request } from 'express'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard) //the same user information provided here same as jwt
  @Post("/login") //onlogin return a token to the client
  async login(@Req() req: Request): Promise<any> {
    const user = this.authService.login(req.user)
    return user
  }//how come we are requesting using req.user


  @UseGuards(JwtAuthGuard)
  @Post("/addPictures") // requure a token from the user and validate token then make the user details available through out teh development cycle
  async addMenuPics(@Req() req: Request){
    return req.user
  }
}


