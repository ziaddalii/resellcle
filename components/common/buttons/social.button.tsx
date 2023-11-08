import {CardActionArea} from "@mui/material";
import Image, {StaticImageData} from "next/image";

interface Props {
    link: string;
    img_url: string | StaticImageData;
    alt: string;
}

export default function SocialButton({link, img_url, alt}: Props) {
    return (
        <a target="_blank" href={link} rel="noopener noreferrer" className="rounded-full border-[0.05rem] border-white">
            <CardActionArea>
                <Image className="w-[2rem]" src={img_url} alt={alt}/>
            </CardActionArea>
        </a>
    );
}
