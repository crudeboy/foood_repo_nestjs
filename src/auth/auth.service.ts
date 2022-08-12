import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UserResponseDTO from 'src/users/dto/userResponseDTO';
import { userResponseType } from 'src/users/interfaces/userResponseType';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(@Inject(forwardRef(() => UsersService)) private usersService: UsersService, private jwtTokenService: JwtService) {}

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

    async loginWithCredentials(user: userResponseType) {
        return new Promise(async (resolve, reject) => {
            try {
                const payload = { username: user.username, id: user.id, role: user.role };
                const login_details = {
                    ...payload,
                    access_token: this.jwtTokenService.sign(payload),
                };
                resolve(login_details);
            } catch (error) {
                reject(error);
            }
        });
    }
}
