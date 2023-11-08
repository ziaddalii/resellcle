"use client";

import {getCookie, setCookie} from "cookies-next";

export const set_cookies_after_login = (token: string, expires_at: string, user_id:string) => {
    
    setCookie(
        "token",
        token,
        {
            domain: process.env.DOMAIN,
            expires: new Date(expires_at),
            path: "/",
            secure: process.env.COOKIE_SECURE === "true",
        },
    );
    setCookie(
        "user_id",
        user_id,
        {
            expires: new Date(expires_at),

        }
    );
};

export const is_authenticated = () => {
    
    return getCookie("token");
};
