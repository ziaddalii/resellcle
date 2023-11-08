import Image, {StaticImageData} from "next/image";
import {Box} from "@mui/material";

type property = {
    preview: string;
    alt: string;
    base: StaticImageData;
};

function ImageCard({preview, base, alt}: property) {
    return (
            <Box className="flex h-52 w-52 relative">
                <Image
                        src={
                            preview ? preview : base
                        }
                        alt={alt}
                        fill
                        style={{
                            objectFit: "cover",
                            objectPosition: "top",
                            borderRadius: "100%",
                        }}
                />
            </Box>
    );
}

export default ImageCard;
