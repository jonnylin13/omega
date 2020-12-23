export interface PreLoginClient {
    username: string;
    password: string;
    hwidNibbles: string;
    attempts: number;
}