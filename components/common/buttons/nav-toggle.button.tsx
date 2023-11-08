"use client";

import MenuIcon from "@mui/icons-material/Menu";
import {Button} from "@mui/material";
import {useState} from "react";

export const sm_nav_state_closed = "w-full transition-all border border-2 duration-500 max-h-0 overflow-hidden";
const sm_nav_state_open = "w-full transition-all border border-2 duration-500 mt-[1.25rem] max-h-[125rem]";

export function NavToggleButton() {

    const [is_open, set_is_open] = useState<boolean>(false);
    const toggle_nav = () => {
        set_is_open(!is_open);

        const elem: HTMLElement = document.getElementById("sm-nav-menu");

        if (!elem) {
            return;
        }

        elem.className = !is_open ? sm_nav_state_open : sm_nav_state_closed;
    };

    return (
            <Button
                    color={is_open ? "primary" : "secondary"}
            >
                <MenuIcon
                        className="cursor-pointer"
                        aria-controls="panel1a-content"
                        onClick={toggle_nav}
                />
            </Button>
    );
}
