import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
        ){}

    async findOne(username: string): Promise<any>{
        const user = await this.userModel.findOne({name: username})
        console.log(user, "user")
        return user
    }
    //create user...sign up
    //get user by id
    //get all users
    
}
