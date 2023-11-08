import {Button, Grid} from "@mui/material";
import Image, {StaticImageData} from "next/image";

interface Props {
    img_url: string | StaticImageData;
    title: string;
}

export default function ThirdPartyButton({img_url, title}: Props) {
    return (
            <Grid item xs={12} md={4}>
                <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            width: "100%",
                            display: "flex",
                            gap: ".5rem",
                            color: "white",
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
