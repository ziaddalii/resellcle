"use client";
import {useEffect} from "react";
import {is_authenticated} from "@/api/cookies.api";
import {get_notifications} from "@/api/requests.api";

export function NotificationsRegister() {

    useEffect(() => {

        if (!is_authenticated()) {
            return;
        }

        get_notifications().then((data) => {
            localStorage.setItem(
                    "notifications",
                    JSON.stringify(
                            data.length
                    )
            );
        });

    }, []);

    return (<></>);
}
