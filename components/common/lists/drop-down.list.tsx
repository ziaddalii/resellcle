// noinspection TypeScriptValidateTypes

"use client";

import { MouseEvent, ReactNode, useState } from "react";
import Button from "@mui/material/Button";
import { Menu } from "@mui/material";
import Link from "next/link";
import { usePopupState, bindFocus, bindHover, bindMenu } from "material-ui-popup-state/hooks";
import HoverMenu from "material-ui-popup-state/HoverMenu";

interface Props {
    trigger: ReactNode;
    menu_list: ReactNode;
    category_name: string;
}

export default function DropDownList({ trigger, menu_list, category_name }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl ?? false);

    const handle_click = (event: MouseEvent<HTMLButtonElement>) => {
        if (menu_list.length === 0) {
            return;
        }

        setAnchorEl(event.currentTarget);
    };

    const handle_close = () => {
        setAnchorEl(null);
    };
    const popupState = usePopupState({
        variant: "popover",
        popupId: "demoMenu",
    });
    return (
        <div className="w-full justify-self-center col-span-1 relative">
            <Button
                component={"a"}
                {...bindHover(popupState)}
                href={`/categories/${encodeURIComponent(category_name)}?page=1`}
                sx={{
                    display: "absolute",
                    zIndex: 100,
                    textTransform: "capitalize",
                    borderRadius: "0",
                    fontWeight: "normal",
                    padding: "0.9rem 0.4rem",
                    color: open ? "white" : "black",
                    textAlign:"center",
                }}
                color={open ? "primary" : "secondary"}
                variant={open ? "contained" : "text"}
                id={`${category_name}-trigger`}
                aria-controls={open ? "menu-list" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                fullWidth
                //     onMouseOver={handle_click}
                //     // onMouseOver={handle_click}
                //     // onMouseLeave={handle_close}
            >
                {trigger}
            </Button>

            {menu_list.length > 0 && (
                <HoverMenu
                    {...bindMenu(popupState)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    // onClose={handle_close}
                    // MenuListProps={{ onMouseLeave: handle_close }}
                >
                    {menu_list}
                </HoverMenu>
            )}
        </div>
    );
}
