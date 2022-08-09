import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getOtp } from './config/otp_config';
import { otpResponseMessage, otpResponseType } from './interfaces/otpResponse';
import { Otp } from './schema/otp.schema';

@Injectable()
export class OtpService {
    constructor(@InjectModel(Otp.name) private otpModel: Model<Otp>) {}

    async generateOtp(user_id: string): Promise<otpResponseMessage> {
        const otp_exists = await this.verifyOtpExists(user_id);

        if (otp_exists) {
            const otp_is_active = await this.verifyOtpIsActive(otp_exists);
            if (otp_is_active) throw new HttpException('User otp already exists.', HttpStatus.BAD_REQUEST);

            const otp = await this.updateUserOtp(user_id);
            return Promise.resolve({ otp, message: 'Otp successfully sent to your mail. Otp would expire in 5 mins' });
        }
        const otp = await this.createOtpForUser(user_id);

        return Promise.resolve({ otp, message: 'Otp successfully sent to your mail. Otp would expire in 5 mins' });
    }

    async verifyOtp(user_id: string, otp: number): Promise<Boolean> {
        const otp_exists = await this.verifyOtpExists(user_id);
        const otp_is_active = await this.verifyOtpIsActive(otp_exists);

        if (!otp_exists) {
            throw new HttpException('User has no active otp', HttpStatus.BAD_REQUEST);
        }
        if (!otp_is_active) {
            throw new HttpException('User has no active otp', HttpStatus.BAD_REQUEST);
        }

        const user_otp = await this.otpModel.findOne({ user_id });
        if (user_otp.otp === otp) {
            const check_time = await this.checkIfOtpHasElapased(user_otp.time_generated);
            if (check_time) {
                await this.deactivateOtp(user_id);
                throw new HttpException('Otp has expired.', HttpStatus.BAD_REQUEST);
            }
            await this.deactivateOtp(user_id);
            return Promise.resolve(true);
        }
        throw new HttpException('Otp is incorrect.', HttpStatus.BAD_REQUEST);
    }

    async checkIfOtpHasElapased(time_genrated: number): Promise<Boolean> {
        const present_time = Date.now();
        const diff = Math.abs(present_time - time_genrated);
        if (diff > 60000 * 5) {
            // one minute
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }

    async verifyOtpExists(user_id: string): Promise<otpResponseType> {
        const user_otp = <otpResponseType>await this.otpModel.findOne({ user_id });
        return Promise.resolve(user_otp);
    }

    async verifyOtpIsActive(otp_details: otpResponseType): Promise<Boolean> {
        return otp_details.is_active ? Promise.resolve(true) : Promise.resolve(false);
    }

    async verifyOtpExistsAndActive(user_id: string): Promise<Boolean> {
        const otp_exists = await this.verifyOtpExists(user_id);
        if (otp_exists) {
            const otp_is_active = await this.verifyOtpIsActive(otp_exists);
            return otp_is_active ? Promise.resolve(true) : Promise.resolve(false);
        }
        return Promise.resolve(false);
    }

    async getOtpByUserId(user_id: string): Promise<any> {
        const otp = await this.otpModel.findOne({ user_id });
        return Promise.resolve(otp);
    }

    async updateUserOtp(user_id: string): Promise<number> {
        try {
            const otp = getOtp();
            const updated_otp = await this.otpModel.findOneAndUpdate(
                { user_id },
                { otp: otp, is_active: true, time_generated: new Date(Date.now()) },
                {
                    new: true,
                },
            );
            return Promise.resolve(otp);
        } catch (error) {
            console.log(error, 'error while updating userotp.');
        }
    }

    async deactivateOtp(user_id: string): Promise<void> {
        try {
            const deactivate_user_otp = await this.otpModel.findOneAndUpdate(
                { user_id },
                { is_active: false },
                {
                    new: true,
                },
            );
            console.log(deactivate_user_otp, 'deactivate_user_otp');
        } catch (error) {
            console.log(error, 'error while updating userotp.');
        }
    }

    async createOtpForUser(user_id: string): Promise<number> {
        try {
            const otp = getOtp();
            await this.otpModel.create({
                user_id,
                otp,
            });
            return Promise.resolve(otp);
        } catch (error) {
            console.log(error, 'error while creating userotp.');
        }
    }
}
