export type UserStatus = "active" | "inactive";

export type User = {
    fullname: string;
    email: string;
    role: string;
    id: string;
    status: UserStatus;
}
