
class UserResponseDTO{
    private id!: string;
    private role!: string;
    private name!: string;
    private message?: string;
    private token?: string;

    constructor() {
        this.id = this.getUserId();
        this.role = this.getUserRole();
        this.name = this.getUserName();
        this.message = this.getMessage();
    }

    public getUserId(): string {
        return this.id
    }

    public setUserId(_id: string): void {
        this.id = _id;
    }

    public getUserRole(): string {
        return this.role;
    }

    public setUserRole(role: string): void {
        this.role = role;
    }

    public getUserName() {
        return this.name;
    }

    public setUserName(name: string) {
        this.name = name;
    }

    public setMessage(message: string): void {
        this.message = message;
    }

    public getMessage(): string {
        return this.message;
    }

    public setToken(token: string): void {
        this.token = token;
    }

    public getToken(): string {
        return this.token;
    }

}

export default UserResponseDTO;