export interface MailInput {
    from: string;
    to: string;
    subject: string;
    html?: string;
    text?: string;
}

export interface IMail {
    to: string;
    subject: string;
    template: string;
    text: string;
    templateVariables: any;
}

export interface IOTPInfo {
    username: string
    email: string
    otp: number
}
