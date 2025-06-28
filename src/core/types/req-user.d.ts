export interface IReqUser {
    userId: string;
    email: string;
    role: 'FREE' | 'PREMIUM';
    iat: number;
    exp: number;
}