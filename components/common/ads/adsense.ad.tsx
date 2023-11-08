import Image from "next/image";
import {Box} from "@mui/material";


interface Props {
    id: string;
    photo_url: string;
    width: number;
    height: number;
    tags_body: string;
    is_visible?: boolean
}

export default function AdsenseAd({id, width, height, photo_url, tags_body, is_visible = true}: Props) {
    return (
        <>
            {is_visible && (
                <Box>
                    {photo_url !== "" ? (
                        <div style={{width: "auto", height: "auto"}} id={id}>
                            <Image className="mx-auto" width={width} height={height} src={photo_url} alt={tags_body}/>
                        </div>
                    ) : (
                        <div dangerouslySetInnerHTML={{__html: tags_body}}></div>
                    )}
                </Box>
            )}
        </>
    );
}
