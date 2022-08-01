import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Console } from "console";
import { Strategy } from 'passport-local';
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService){
        super();
    }
//what signals local passport strategy in this file, how does the auth guard precisely calls this class
    async validate(username: string, password: string){
        const user = await this.authService.validateUser(username, password);
        console.log(user, ":USER")
        if(!user){
            throw new UnauthorizedException()
        }
        return user;//this user becomes available after the guard has been sclaed through on the req object
    }
}
