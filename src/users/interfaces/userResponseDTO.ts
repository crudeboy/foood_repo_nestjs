class UserResponseDTO {
    private id!: string;
    private role!: string;
    private name!: string;

    constructor() {
        this.id = this.getUserId();
        this.role = this.getUserRole();
        this.name = this.getUserName();
    }

    public getUserId(): string {
        return this.id;
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
}

export default UserResponseDTO;
