import {Button} from "@mui/material";
import {GlobalInterface} from "@/interfaces/global.interface";

interface Props extends GlobalInterface {}

export default function ViewMoreButton({t}: Props) {
    
    return (
        <Button
            variant="contained"
            color="primary"
            sx={{
                color: "white",
            }}
        >
            {t!("fields.view_more")}
        </Button>
    );
}
