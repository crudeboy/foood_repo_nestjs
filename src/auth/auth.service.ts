import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtTokenService: JwtService) {}

    async validateUserCredentials(username: string, password: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.usersService.findUser(username, password);

                if (user) {
                    const { password, id: _id, name: username, role } = user;
                    const user_info = {
                        id: _id,
                        name: username,
                        role,
                    };
                    resolve(user_info);
                }
                resolve(undefined);
            } catch (error) {
                reject(error);
            }
        });
    }

    async loginWithCredentials(user: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const payload = { username: user.name, id: user.id };
                const user_details = await this.usersService.findOne(user.name);
                console.log(user_details, 'user_details');
                const login_details = {
                    ...payload,
                    access_token: this.jwtTokenService.sign(payload),
                };
                console.log(login_details, 'login_details');
                resolve(login_details);
            } catch (error) {
                reject(error);
            }
        });
    }
}
