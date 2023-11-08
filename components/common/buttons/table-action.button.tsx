import {ReactNode} from "react";
import {Button} from "@mui/material";

interface Props {
    children: ReactNode;
    color: "error" | "primary"
    isLoading:boolean;
}

export function TableActionButton({isLoading, children, color}: Props) {
    return (
        <Button disabled={isLoading} sx={{minWidth:"48px", padding:"5px 5px"}} variant="outlined" color={color}>
            {children}
        </Button>
    );
}
