// noinspection TypeScriptValidateTypes

"use client";

import NotificationsIcon from "@mui/icons-material/Notifications";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

export default function NotificationButton() {
    const [is_disabled, set_is_disabled] = useState(true);
    const [notifications_count, set_notifications_count] = useState(0);

    useEffect(() => {
        function checkNotificationsCount() {
            const local_notifications_count = localStorage.getItem("notifications") ?? "0";
            set_notifications_count(local_notifications_count);

            if (local_notifications_count > 0) {
                set_is_disabled(false);
            }
        }
        checkNotificationsCount();
        window.addEventListener("storage", checkNotificationsCount);

        return () => {
            window.removeEventListener("storage", checkNotificationsCount);
        };
    }, []);

    return (
        <Button
            disabled={is_disabled}
            component={"a"}
            href="/auth/account/notifications"
            color="primary"
            className="!rounded-full relative"
            variant="contained"
            sx={{ width: "40px", height: "40px", minWidth: "0", padding: "0" }}
            aria-label={`Notifications: ${notifications_count}`}
        >
            <NotificationsIcon className="text-white" fontSize="small" />

            {
                notifications_count !== "0" &&
                <span
                    className={
                        "absolute top-0 right-[-6px] bg-red-700 flex justify-center items-center rounded-full w-5 h-5 font-bold text-xs text-white " +
                        (is_disabled ? "opacity-50" : "opactiy-100")
                    }
                >
                    {notifications_count}
                </span>
            }
        </Button>
    );
}
