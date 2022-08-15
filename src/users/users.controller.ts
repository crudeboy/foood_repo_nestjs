import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { OtpService } from 'src/auth/otp.service';
import { userResponseType } from './interfaces/userResponseType';
import { UsersService } from './users.service';
import { CreateUserModel } from './validations/createUser.validation';
import { GenerateOtpValidator } from './validations/generateOtp';
import { VerifyOtpValidator } from './validations/verifyOtp';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService, private authService: AuthService, private otpService: OtpService) {}

    @Post('/sign_up')
    async sign_up(@Req() req: Request, @Res() res: Response, @Body() user_details: CreateUserModel) {
        const { username, email, password } = user_details;
        console.log(user_details, "user_details")
        const new_user = await this.userService.createUser(username, email, password);
        res.send(new_user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getUserById/:id')
    async getUserById(@Req() req: Request, @Res() res: Response, @Param() id: string): Promise<any> {
        const user = await this.userService.getById(id);
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
    async login(@Req() req: Request, @Res() res: Response) {
        const user = <userResponseType>req.user;
        const user_details = await this.authService.loginWithCredentials(user);
        return res.json(user_details);
    }

    @Post('/generateOtp')
    async generateOtp(@Req() req: Request, @Res() res: Response, @Body() otp_model: GenerateOtpValidator) {
        const otp = await this.otpService.generateOtp(otp_model.user_id);
        return res.json({
            success: true,
            otp,
        });
    }

    @Post('/verifyOtp')
    async verifyOtp(@Req() req: Request, @Res() res: Response, @Body() otp_details: VerifyOtpValidator) {
        const { user_id, otp } = otp_details;
        const isValid = await this.userService.verifyUserOtp(user_id, otp);
        return res.json({
            success: isValid,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post('/addPictures')
    async addMenuPics(@Req() req: Request) {
        return req.user;
    }
}
