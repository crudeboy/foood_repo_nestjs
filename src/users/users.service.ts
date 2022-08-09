/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/order */
/* eslint-disable import/no-unresolved */
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import mongoose, { Model } from 'mongoose';
import { BcryptService } from './helpers/hashing.service';
import UserResponseDTO from './dto/userResponseDTO';
import { OtpService } from 'src/auth/otp.service';
import { AuthService } from 'src/auth/auth.service';
import { userResponseType } from './interfaces/userResponseType';
import { MailService } from 'src/notification/mail.service';
import { otpResponseMessage } from 'src/auth/interfaces/otpResponse';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private bcryptService: BcryptService,
        private otpService: OtpService,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
        private mailService: MailService
    ) {}

    async findOne(username: string): Promise<any> {
        const user = await this.userModel.findOne({ name: username });
        return user;
    }

    async findUser(username: string, password): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.findOne(username);
                const passwordMatch = await this.bcryptService.comparePassword(password, user.password);
                passwordMatch ? resolve(user) : resolve(undefined);
            } catch (error) {
                reject(error);
            }
        });
    }

    async createUser(username: string, email: string, password: string): Promise<any> {
        try {
            const hashedPassoword = await this.bcryptService.hashPassword(password);

            const email_exists = await this.checkForUniqueEmail(email);
            if (email_exists) {
                throw new HttpException('Email already exists.', HttpStatus.CONFLICT);
            }
            const username_exists = await this.checkForUniqueEmail(email);
            if (username_exists) {
                throw new HttpException('Username already exists.', HttpStatus.CONFLICT);
            }
            const user = new UserResponseDTO();

            const user_info = await this.userModel.create({
                name: username,
                password: hashedPassoword,
                email,
            });
            user.setUserId(user_info._id);
            user.setUserName(user_info.name);
            user.setUserRole(user_info.role);
            user.setMessage('Otp has been sent to ypur email.');
            //trigger an event to generate an otp for the
            const otp = await this.generateUserOtp(user.getUserId())
            console.log(otp, "otp", user, "user")
            //send otp email...
            await this.mailService.sendOtp(username, email, otp.otp)
            return Promise.resolve(user);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async checkForUniqueUsername(username: string): Promise<Boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.getByUsername(username);
                if (user) resolve(true);
                resolve(false);
            } catch (error) {
                reject(error);
            }
        });
    }

    async checkForUniqueEmail(email: string): Promise<Boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.getByEmail(email);
                if (user) resolve(true);
                resolve(false);
            } catch (error) {
                reject(error);
            }
        });
    }

    async getById(id: string): Promise<UserResponseDTO> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = new UserResponseDTO();
                const user_info = await this.userModel.findById(new mongoose.mongo.ObjectId(id));
                if (!user_info) {
                    throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
                }
                user.setUserId(user_info._id);
                user.setUserName(user_info.name);
                user.setUserRole(user_info.role);
                resolve(user);
            } catch (error) {
                reject(error);
            }
        });
    }

    async getByUsername(username: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.userModel.findOne({ username });
                resolve(user);
            } catch (error) {
                reject(error);
            }
        });
    }

    async getByEmail(email: string): Promise<any> {
        const user = await this.userModel.findOne({ email });
        return user;
    }

    async generateUserOtp(user_id: string): Promise<otpResponseMessage>{
        const otp_response = await this.otpService.generateOtp(user_id)
        return Promise.resolve(otp_response)
    }

    async verifyUserOtp(userId: string, otp: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const otp_verified = await this.otpService.verifyOtp(userId, otp);
                if (otp) {
                    const user = <userResponseType>(<unknown>await this.getById(userId));

                    // const user = new UserResponseDTO();
                    // user.setUserId(user_info.getUserId());
                    // user.setUserName(user_info.getUserName());
                    // user.setUserRole(user_info.getUserRole());
                    const verifiedUser = await this.authService.loginWithCredentials(user);
                    resolve(user);
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}
