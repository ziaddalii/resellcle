/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {GlobalInterface} from "@/interfaces/global.interface";
import {LinearProgress} from "@mui/material";
import {useEffect, useState} from "react";
import {sleep} from "@/util/formatting.util";

interface Props extends GlobalInterface {
}

interface Payload {
    status: boolean;
}


export async function toggle_loading(status: boolean) {
    window.dispatchEvent(
            new CustomEvent<Payload>(
                    "toggle_loading",
                    {
                        detail: {status},
                    },
            ),
    );
    await sleep(1);
}

export function GlobalProgressBarNotification({}: Props) {

    const [show, set_show] = useState<boolean>(false);

    const on_toggle_loading = ({detail: {status}}: CustomEvent<Payload>) => {
        set_show(status);
    };

    useEffect(() => {

        window.addEventListener("toggle_loading", on_toggle_loading);

        return () => {
            window.removeEventListener("toggle_loading", on_toggle_loading);
        };
    }, []);

    return (
            show && <LinearProgress
                    id="global-progress-bar"
                    variant="indeterminate"
                    color="primary"
            ></LinearProgress>
    );
}
