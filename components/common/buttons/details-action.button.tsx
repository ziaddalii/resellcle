"use client";

import {Button, Tooltip} from "@mui/material";
import {ReactNode} from "react";

interface Props {
    icon: ReactNode;
    label: string;
    action?: () => void;
    color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
}

export default function DetailsActionButton({icon, label, action, color = "primary"}: Props) {
    return (
        <Tooltip title={label} arrow placement="top">
            <Button
                color={color}
                onClick={action}
                sx={{color: "white", width: "3rem", height: "3rem"}}
                variant="contained"
                className="p-4">
                {icon}
            </Button>
        </Tooltip>
    );
}
