import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class Otp extends Document {
    @Prop({ required: true, unique: true, default: uuidv4() })
    id: string;

    @Prop({ required: true, unique: true })
    otp: number;

    @Prop({ required: true, unique: true })
    user_id: string;

    @Prop({ required: true, default: new Date(Date.now()) })
    time_generated: number;

    @Prop({ required: true, default: true })
    is_active: Boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
