import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UUID } from "bson";
import { Document } from "mongoose"
import { UserrequestDTO } from "./users.interface";

@Schema({ timestamps: true })
export class User extends Document implements UserrequestDTO {
    @Prop({required: true})
    name: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({
        type: String,
        enum : ['user','admin'],
        default: 'user'
    })
    role: string;

}

export const UserSchema = SchemaFactory.createForClass(User)