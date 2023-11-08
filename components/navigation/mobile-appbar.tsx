// noinspection TypeScriptValidateTypes

"use client";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useTranslations } from "next-intl";
import { Box, useTheme } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { deleteCookie } from "cookies-next";

interface Props {
    token: string;
}

export default function MobileAppbar({ token }: Props) {
    const t = useTranslations();

    const theme = useTheme();

    const handle_logout = () => {
        deleteCookie("token");
        localStorage.setItem("favorites", JSON.stringify([]));
        localStorage.setItem("notifications", 0);
        window.location.replace("/");
    };

    return (
        <Box className="fixed bottom-0 w-full z-[51] md:hidden border-t-1 border-t">
            <BottomNavigation
                showLabels
                sx={{
                    backgroundColor: theme.palette.primary.main,
                }}
            >
                {/*Home*/}
                <BottomNavigationAction
                    component={"a"}
                    sx={{
                        color: "white",
                        fontSize: "10px",
                        padding: "0",
                        minWidth: "0",
                        "& .MuiBottomNavigationAction-label": {
                            fontSize: "10px",
                        },
                    }}
                    href="/"
                    label={t("pages.home_short")}
                    icon={<HomeIcon />}
                />

                {/*Categories*/}
                <BottomNavigationAction
                    component={"a"}
                    sx={{
                        color: "white",
                        fontSize: "10px",
                        padding: "0",
                        minWidth: "0",
                        "& .MuiBottomNavigationAction-label": {
                            fontSize: "10px",
                        },
                    }}
                    href="/categories"
                    label={t("pages.categories")}
                    icon={<StorefrontIcon />}
                />

                {/*Categories*/}
                <BottomNavigationAction
                    component={"a"}
                    sx={{
                        color: "white",
                        fontSize: "10px",
                        padding: "0",
                        minWidth: "0",
                        "& .MuiBottomNavigationAction-label": {
                            fontSize: "10px",
                        },
                    }}
                    href="/auth/account/ads/new"
                    label={t("ads.add_new_ads")}
                    icon={<AddIcon />}
                />

                {token && (
                    <BottomNavigationAction
                        component={"a"}
                        sx={{
                            color: "white",
                            fontSize: "10px",
                            padding: "0",
                            minWidth: "0",
                            "& .MuiBottomNavigationAction-label": {
                                fontSize: "10px",
                            },
                        }}
                        href="/auth/account"
                        label={t("fields.my_account")}
                        icon={<PersonIcon />}
                    />
                )}

                {token && (
                    <BottomNavigationAction
                        onClick={handle_logout}
                        sx={{
                            color: "white",
                            fontSize: "10px",
                            padding: "0",
                            minWidth: "0",
                            "& .MuiBottomNavigationAction-label": {
                                fontSize: "10px",
                            },
                        }}
                        label={t("fields.logout")}
                        icon={<LogoutIcon />}
                    />
                )}

                {!token && (
                    <BottomNavigationAction
                        component={"a"}
                        sx={{
                            color: "white",
                            fontSize: "10px",
                            padding: "0",
                            minWidth: "0",
                            "& .MuiBottomNavigationAction-label": {
                                fontSize: "10px",
                            },
                        }}
                        href="/auth/register"
                        label={t("pages.register")}
                        icon={<PersonAddAlt1Icon />}
                    />
                )}

                {!token && (
                    <BottomNavigationAction
                        component={"a"}
                        sx={{
                            color: "white",
                            fontSize: "10px",
                            padding: "0",
                            minWidth: "0",
                            "& .MuiBottomNavigationAction-label": {
                                fontSize: "10px",
                            },
                        }}
                        href="/auth/login"
                        label={t("pages.login")}
                        icon={<LoginIcon />}
                    />
                )}
            </BottomNavigation>
        </Box>
    );
}
