/* eslint-disable import/no-unresolved */
/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line object-curly-newline
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller('/root')
// eslint-disable-next-line import/prefer-default-export
export class AppController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('')
    async login(@Request() _req) {
        return 'This application is live.';
    }

    // @UseGuards(JwtAuthGuard)
    @Get('app-info')
    getUserInfo(@Request() _req) {
        return {
            info: 'the api doc, for seemless integration into your apps.',
        };
    }
}
