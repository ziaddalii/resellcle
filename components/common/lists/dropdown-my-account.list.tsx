/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {MouseEvent, ReactNode, useMemo, useState} from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonIcon from "@mui/icons-material/Person";
import {MenuItem} from "@mui/material";
import {useTranslations} from "next-intl";
import {deleteCookie} from "cookies-next";
import {useRouter} from "next-intl/client";

interface Props {
    trigger: ReactNode;
}

export default function DropDownMyAccountList({trigger}: Props) {
    const t = useTranslations();
    
    const menu_list = useMemo(() => [
        {
            id: "01",
            name: t("fields.my_account"),
            link: "/auth/account",
        },
        {
            id: "02",
            name: t("account.edit_your_account_information"),
            link: "/auth/account/personal-info",
        },
        {
            id: "03",
            name: t("account.change_your_password"),
            link: "/auth/account/password",
        },
        {
            id: "04",
            name: t("account.seller_profile"),
            link: "/auth/account/seller",
        },
        {
            id: "05",
            name: t("account.modify_your_wish_list"),
            link: "/auth/account/favorites",
        },
        {
            id: "06",
            name: t("fields.my_ads_list"),
            link: "/auth/account/ads?page=1",
        },
        {
            id: "07",
            name: t("fields.post_free_ad"),
            link: "/auth/account/ads/new",
        },
        {
            id: "08",
            name: t("fields.messages"),
            link: "/auth/account/messages?page=1",
        },
    ], []);
    
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    
    const open = Boolean(anchorEl ?? false);
    
    const handle_click = (event: MouseEvent<HTMLButtonElement>) => {
        if (menu_list.length === 0) {
            return;
        }
        setAnchorEl(event.currentTarget);
    };
    
    const handle_logout = () => {
        deleteCookie("token");
        localStorage.setItem("favorites", JSON.stringify([]));
        localStorage.setItem("notifications", 0);
        // router.refresh();
        window.location.replace("/");

    };
    
    const handle_close = () => {
        setAnchorEl(null);
    };
    
    return (
        <div className="w-full justify-self-center col-span-1">
            <Button
                startIcon={<PersonIcon/>}
                endIcon={<ArrowDropDownIcon/>}
                color="secondary"
                variant="contained"
                className="flex gap-1 items-center max-h-[2.5rem] h-full"
                id="my-account-list-trigger"
                aria-controls={open ? "menu-list" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handle_click}
                fullWidth
            >
                {trigger}
            </Button>
            
            {menu_list.length > 0 && (
                <Menu
                    id="menu-list"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handle_close}
                    MenuListProps={{
                        "aria-labelledby": "menu-trigger",
                    }}
                >
                    {menu_list.map((e) => (
                        <a onClick={handle_close} key={e.id} href={e.link}>
                            <MenuItem sx={{
                                fontSize: "1rem",
                            }}
                            >
                                {e.name}
                            </MenuItem>
                        </a>
                    ))}
                    
                    {/*Logout*/}
                    <MenuItem
                        onClick={handle_logout}
                        sx={{
                            fontSize: "1rem",
                        }}
                    >
                        {t("fields.logout")}
                    </MenuItem>
                </Menu>
            )}
        </div>
    );
}
