/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/order */
/* eslint-disable import/no-unresolved */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import mongoose, { Model } from 'mongoose';
import { BcryptService } from './helpers/hashing.service';
import { ObjectId } from 'mongodb';
import { resolve } from 'path';
import { rejects } from 'assert';
import UserResponseDTO from './interfaces/userResponseDTO';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private bcryptService: BcryptService) {}

    async findOne(username: string): Promise<any> {
        const user = await this.userModel.findOne({ name: username });
        console.log(user, 'user');
        return user;
    }

    async comparePassword(password: string): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            try {
            } catch (error) {
                reject(error);
            }
        });
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

    async create(username: string, email: string, password: string): Promise<any> {
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

            const user = await this.userModel.create({
                name: username,
                password: hashedPassoword,
                email,
            });
            return Promise.resolve(user);
        } catch (error) {
            return Promise.reject(error);
            console.log(error, 'error occurred while creating user');
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
}
