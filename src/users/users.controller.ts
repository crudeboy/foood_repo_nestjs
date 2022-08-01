import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response, Request } from 'express'
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {

    constructor(
      private userService: UsersService,
      // private authService: AuthService
      ) {}

    @Get("/")
    getHello(): string {
      return "hello"
    }

    @UseGuards(LocalAuthGuard) //the same user information provided here same as jwt
    @Post("/login") //onlogin return a token to the client
    async login(@Req() req: Request): Promise<any> {
      // const user = this.authService.login(req.user)
      return "user"
    }//how come we are requesting using req.user


    @UseGuards(JwtAuthGuard)
    @Post("/addPictures") // requure a token from the user and validate token then make the user details available through out teh development cycle
    async addMenuPics(@Req() req: Request){
      return req.user
    }
}
