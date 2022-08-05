/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unresolved */
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Match } from './validator.index';

export class CreateUserModel {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password is too weak, it must contain at least one lower case letter, one uppercase letter, one number and one special character.',
    })
    password: string;

    @IsString()
    @Match('password', {
        message: 'passwordConfirm must be same as the password.',
    })
    passwordConfirm: string;
}
