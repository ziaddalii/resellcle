// noinspection TypeScriptValidateTypes

import {redirect} from "next/navigation";
import {ReactNode} from "react";
import {cookies, headers} from "next/headers";

export default async function AuthLayout({children}: { children: ReactNode }) {
    
    const active_path = headers().get("x-invoke-path");
    
    // IF LOGGED IN
    if (
        (active_path?.includes("auth/login") || active_path?.includes("auth/register")) &&
        cookies().get("token")?.value
    ) {
        redirect("/");
    }
    
    if (
        (active_path?.includes("account/") && !cookies().get("token")?.value)
    ) {
        // notFound(); // OR GO TO LOGIN
        redirect("/auth/login");
    }
    
    return <>{children}</>;
}
