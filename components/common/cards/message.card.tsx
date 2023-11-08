"use client";
import {Box, Typography} from "@mui/material";
import {useState} from "react";
import {useTranslations} from "next-intl";

interface Props {
    date_ago: string;
    message: string;
    color: string;
    alignment: string;
}

export function MessageCard({message, color, alignment, date_ago}: Props) {
    const [showDate, setShowDate] = useState(false);
    const t = useTranslations();
    return (
            <Box sx={{textAlign: alignment, margin: ".5rem .25rem"}} onClick={() => {
                setShowDate(!showDate);
            }}>

                <Box bgcolor={color} sx={{
                    cursor: "pointer",
                    display: "inline-block",
                    maxWidth: "80%",
                    color: "white",
                    padding: ".75rem 2rem",
                    borderRadius: alignment === "right" ? "25px 25px 0px 25px" : "25px 25px 25px 0px",
                }}>
                    <Typography component="span" className="break-words">{message}</Typography>
                    <p className="text-secondary text-xs">{date_ago}</p>
                </Box>

            </Box>
    );
}
