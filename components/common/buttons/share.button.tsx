import {Button} from "@mui/material";
import {MouseEventHandler} from "react";
import Image from "next/image";
import {GlobalInterface} from "@/interfaces/global.interface";

interface Props extends GlobalInterface {
    item: {
        social_media: string;
        icon: string;
        link: string;
    };
    share_link: string;
    onClick?: MouseEventHandler;
}

export default function ShareButton({t, share_link, item, onClick}: Props) {
    
    return (
        // <a target="_blank" href={`${item.link}/${encodeURIComponent(share_link)}`} rel="noopener noreferrer">
            <Button
                component="a"
                href={`${item.link}/${encodeURIComponent(share_link)}`}
                onClick={onClick}
                className="!text-white !bg-black space-x-2 !py-2 !px-4">
                <Image width={20} height={20} src={item.icon} alt={item.social_media}/>
                <span> {t!("fields.share")}</span>
            </Button>
        // </a>
    );
}
