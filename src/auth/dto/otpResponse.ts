class OtpResponseDTO{
    private id!: string;
    private user_id!: string;

    constructor() {
        this.id = this.getId();
        this.user_id = this.getUserId();
    }

    public getUserId(): string {
        return this.user_id;
    }

    public setUserId(user_id: string): void {
        this.user_id = user_id;
    }

    public getId(): string {
        return this.id;
    }

    public setUserRole(id: string): void {
        this.id = id;
    }

}

export default OtpResponseDTO;