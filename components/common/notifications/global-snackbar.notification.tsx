"use client";

import {GlobalInterface} from "@/interfaces/global.interface";
import {Alert, Snackbar} from "@mui/material";
import {useEffect, useState} from "react";

interface Props extends GlobalInterface {
}

interface Payload {
    error: boolean;
    message: string;
}

export function notify(error: boolean, message: string) {
    window.dispatchEvent(
            new CustomEvent<Payload>(
                    "notify",
                    {
                        detail: {error, message},
                    },
            ),
    );
}

export function GlobalSnackbarNotification({locale}: Props) {

    const [show, set_show] = useState<boolean>(false);
    const [message, set_message] = useState<string>("");
    const [is_error, set_is_error] = useState<boolean>(false);

    const on_notify = ({detail: {error, message}}: CustomEvent<Payload>) => {
        set_is_error(error);
        set_message(message);
        set_show(true);
    };

    useEffect(() => {

        window.addEventListener("notify", on_notify);

        return () => {
            window.removeEventListener("notify", on_notify);
        };
    }, []);

    return (
            <Snackbar
                    id="global-snackbar-notification"
                    anchorOrigin={{vertical: "top", horizontal: "center"}}
                    autoHideDuration={5000}
                    onClose={() => (set_show(false))}
                    open={show}
            >
                <Alert severity={is_error ? "error" : "success"}
                       sx={{width: "100%"}}>
                    {message}
                </Alert>
            </Snackbar>
    );
}
