import { ADMIN_CONFIG, STUDENT_CONFIG } from "@/core/config/auth";
import { UserRole } from "@/core/constants/ENUMS/user";
import { Response } from "express";

export interface ISetRefreshCookie {
    res: Response;
    cookieValue: string;
    usageType: UserRole
}

const setRefreshTokenCookie = ({ res, cookieValue, usageType }: ISetRefreshCookie) => {

    const maxAge = usageType === UserRole.ADMIN ? ADMIN_CONFIG.refreshTokenExpiry : STUDENT_CONFIG.refreshTokenExpiry

    const cookieKey = usageType === UserRole.ADMIN ? ADMIN_CONFIG.ADMIN_REFRESH_TOKEN_KEY : STUDENT_CONFIG.STUDENT_REFRESH_TOKEN_KEY

    res.cookie(cookieKey, cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: maxAge,
        path: "/"
    })

}



const setAccessTokenCookie = ({ res, cookieValue, usageType }: ISetRefreshCookie) => {

    const maxAge = usageType === UserRole.ADMIN ? ADMIN_CONFIG.accessTokenExpiry : STUDENT_CONFIG.accessTokenExpiry

    const cookieKey = usageType === UserRole.ADMIN ? ADMIN_CONFIG.ADMIN_ACCESS_TOKEN_KEY : STUDENT_CONFIG.STUDENT_ACCESS_TOKEN_KEY

    res.cookie(cookieKey, cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: maxAge,
        path: "/"
    })

}


const setLoggedInCookie = ({ res, cookieValue, usageType }: ISetRefreshCookie) => {

    const maxAge = usageType === UserRole.ADMIN ? ADMIN_CONFIG.refreshTokenExpiry : STUDENT_CONFIG.refreshTokenExpiry

    const cookieKey = usageType === UserRole.ADMIN ? ADMIN_CONFIG.LOGGED_IN_KEY : STUDENT_CONFIG.LOGGED_IN_KEY

    res.cookie(cookieKey, cookieValue, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: maxAge,
        path: "/"
    })

}


export { setRefreshTokenCookie, setAccessTokenCookie, setLoggedInCookie }