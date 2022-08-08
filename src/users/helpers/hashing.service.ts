/* eslint-disable class-methods-use-this */
/* eslint-disable no-async-promise-executor */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable import/prefer-default-export */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
    constructor(private configService: ConfigService) {}

    async hashPassword(password: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const hash = await bcrypt.hash(password, Number(this.configService.get('BCRYPT_SALT')));
                resolve(hash);
            } catch (error) {
                reject('Error occurred while hashing password.');
            }
        });
    }

    async comparePassword(password: string, hash: string): Promise<Boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const isMatch = await bcrypt.compare(password, hash);
                resolve(isMatch);
            } catch (error) {
                reject('Error occurred while comparing password.');
            }
        });
    }
}
