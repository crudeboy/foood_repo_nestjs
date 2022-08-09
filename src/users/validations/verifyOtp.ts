import { IsEmail, IsNumber, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class VerifyOtpValidator {
    @IsString()
    @IsObjectId()
    user_id: string;

    @IsNumber()
    otp: number;
}