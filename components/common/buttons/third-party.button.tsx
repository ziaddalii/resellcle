import {Button, Grid} from "@mui/material";
import Image, {StaticImageData} from "next/image";

interface Props {
    img_url: string | StaticImageData;
    title: string;
    bg_color:string;
}

export default function ThirdPartyButton({bg_color, img_url, title}: Props) {
    return (
            <Grid item xs={12} md={4}>
                <Button
                        variant="contained"
                        // color={bg_color}
                        
                        sx={{
                            width: "100%",
                            display: "flex",
                            gap: ".5rem",
                            color: "white",
                            backgroundColor:`${bg_color}!important`,
                            fontWeight: "bold",
                        }}>
                    <Image
                            className="w-[1.2rem]"
                            src={img_url}
                            alt={title}
                    />
                    {title}
                </Button>
            </Grid>
    );
}
