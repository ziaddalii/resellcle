"use client";
import { MouseEvent, useState } from "react";
import { Container, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { useTranslations } from "next-intl";
import ShareIcon from "@mui/icons-material/Share";
import facebook from "@/public/social-media/facebook.png";
// import twitter from "@/public/social-media/twitter.png";
import whatsapp from "@/public/social-media/whatsapp.png";
import messenger from "@/public/social-media/facebook-messenger.png";
import Image from "next/image";
import FavoriteButton from "@/components/common/buttons/favorite.button";
import { ReportButton } from "@/components/common/buttons/report.button";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import twitter from "@/public/social-media/x-logo.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import { getCookie } from "cookies-next";
const shareButtons = [
    {
        social_media: "facebook",
        icon: <img src={facebook.src} />,
        link: "https://www.facebook.com/sharer/sharer.php?u=",
    },
    // {
    //     social_media: "messenger",
    //     icon: facebookMessenger.src,
    // },
    {
        social_media: "whatsapp",
        icon: <img src={whatsapp.src} />,
        link: "whatsapp://send?text=&amp;url=",
    },
    {
        social_media: "twitter",
        icon: <img src={twitter.src} />,
        link: "https://twitter.com/intent/tweet?url=",
    },
];

const AdActionsList = ({ share_link, ad_id, locale, token }) => {
    const t = useTranslations();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const copy_to_clipboard = (text: string) => {

        window.prompt("Copy to clipboard: Ctrl+C, Enter", text);

        //NOT WORKING
        // if (!navigator.clipboard) {
        //     const textArea = document.createElement("textarea");
        //
        //     textArea.value = text;
        //
        //     // Avoid scrolling to bottom
        //     textArea.style.top = "1";
        //     textArea.style.left = "0";
        //     textArea.style.position = "fixed";
        //
        //     document.body.appendChild(textArea);
        //     textArea.focus();
        //     textArea.select();
        //
        //     try {
        //         document.execCommand("copy");
        //     } catch (e) {
        //     }
        //
        //     document.body.removeChild(textArea);
        //     handleClose();
        //     return;
        // }
        // navigator.clipboard.writeText(text);

        handleClose();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <Container maxWidth="xl">
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    {/* Share Button */}
                    {token && <ReportButton ad_id={ad_id} locale={locale} />}
                </div>
                <div className="flex gap-2">

                    {/* Share Button */}
                    <IconButton
                        aria-label="share"
                        id="share-button"
                        aria-controls={open ? "long-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <ShareIcon />
                    </IconButton>

                    <Menu
                        id="share-menu"
                        MenuListProps={{
                            "aria-labelledby": "share-button",
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >

                        <MenuItem onClick={handleClose}>
                            <a
                                className="lg:flex hidden"
                                target="_blank"
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(share_link)}`}
                            >
                                <ListItemIcon>
                                    <FacebookIcon sx={{ color: "#1877F2" }} />
                                </ListItemIcon>
                                <ListItemText>{t("fields.facebook")}</ListItemText>
                            </a>
                            <a
                                className="lg:hidden flex"
                                target="_blank"
                                href={`fb://faceweb/f?href=${encodeURIComponent("https://m.facebook.com/")}sharer.php${share_link}`}
                            >
                                <ListItemIcon>
                                    <FacebookIcon sx={{ color: "#1877F2" }} />
                                </ListItemIcon>
                                <ListItemText>{t("fields.facebook")}</ListItemText>
                            </a>
                        </MenuItem>
                        <MenuItem className="md:!hidden" onClick={handleClose}>
                            <a
                                className="flex"
                                target="_blank"
                                href={`fb-messenger://share/?link=${encodeURIComponent(share_link)}`}
                            >
                                <ListItemIcon>
                                    <Image width={21} height={21} alt="facebook" className="object-contain" src={messenger.src} />
                                </ListItemIcon>
                                <ListItemText>{t("fields.messenger")}</ListItemText>
                            </a>
                        </MenuItem>

                        <MenuItem onClick={handleClose}>
                            <a
                                className="flex"
                                target="_blank"
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(share_link)}`}
                            >
                                <ListItemIcon>
                                    <Image width={21} height={21} alt="facebook" className="object-contain" src={twitter.src} />
                                </ListItemIcon>
                                <ListItemText>{t("fields.x")}</ListItemText>
                            </a>
                        </MenuItem>

                        <MenuItem onClick={handleClose}>
                            <a
                                className="flex"
                                target="_blank"
                                href={`https://wa.me/?text=${encodeURIComponent(share_link)}`}
                            >
                                <ListItemIcon>
                                    <WhatsAppIcon sx={{ color: "#25D366" }} />
                                </ListItemIcon>
                                <ListItemText>{t("fields.whatsapp")}</ListItemText>
                            </a>
                        </MenuItem>

                        <MenuItem onClick={() => copy_to_clipboard(share_link)}>
                            <ListItemIcon>
                                <ContentCopy />
                            </ListItemIcon>
                            <ListItemText>{t("fields.copy")}</ListItemText>
                        </MenuItem>
                    </Menu>
                    {/* Favoite Button */}
                    {token && <FavoriteButton alt ad_id={ad_id} locale={locale} />}
                </div>
            </div>
        </Container>
    );
};

export default AdActionsList;
