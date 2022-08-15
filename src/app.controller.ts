/* eslint-disable import/no-unresolved */
/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line object-curly-newline
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller('/')
// eslint-disable-next-line import/prefer-default-export
export class AppController {
    constructor(private authService: AuthService,
        private appService: AppService) {}

    @UseGuards(AuthGuard('local'))
    @Post('')
    async login(@Request() _req) {
        return 'This application is live.';
    }

    @Post('/testing-events')
    async event(@Request() _req) {
        await this.appService.emitEvent()
        return 'This application is live.';
    }

    // @UseGuards(JwtAuthGuard)
    @Get('')
    getUserInfo(@Request() _req) {
        return {
            info: 'the api doc, for seemless integration into your apps.',
        };
    }
}
