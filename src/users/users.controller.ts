/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-return-await */
/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { UsersService } from './users.service';
import { CreateUserModel } from './validations/createUser.validation';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService, private authService: AuthService) {}

    @Post('/sign_up')
    async sign_up(@Req() req: Request, @Res() res: Response, @Body() user_details: CreateUserModel) {
        const { username, email, password } = user_details;
        const new_user = await this.userService.create(username, email, password);
        res.send(new_user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getUserById/:id')
    async getUserById(@Req() req: Request, @Res() res: Response, @Param() id: string): Promise<any> {
        const user = await this.userService.getById(id);
        console.log('user by id', user);
        res.send(user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/getByUsername')
    async getByUsername(@Param() username: string, @Res() res: Response): Promise<any> {
        try {
            return await this.userService.findOne(username).then((result) => result);
        } catch (error) {
            return res.json({
                success: false,
                message: 'Error occurred while getting user details.',
            });
        }
    }

    @UseGuards(LocalAuthGuard) //how to have the user object available on every request
    @Post('/login')
    async login(@Req() req: Request, @Res() res: Response): Promise<any> {
        console.log(req.user, 'req.user');
        const user = await this.authService.loginWithCredentials(req.user);
        return res.json(user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/addPictures')
    async addMenuPics(@Req() req: Request) {
        return req.user;
    }
}
