export interface otpResponseType {
    id: string
    user_id: string
    is_active: Boolean
}

export interface otpResponseMessage {
    otp: number
    message: string
}