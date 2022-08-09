import { IsEmail, IsString, IS_MONGO_ID } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class GenerateOtpValidator {
    @IsString()
    @IsObjectId()
    user_id: string;

    @IsEmail()
    email: string;
}