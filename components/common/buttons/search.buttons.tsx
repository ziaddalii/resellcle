"use client";

import {Search} from "@mui/icons-material";
import {Button} from "@mui/material";

interface Props {
    onClick: Function;
}

export default function SearchButton({onClick}: Props) {

    return (
        <Button
            aria-label="search"
            onClick={onClick}
            color="secondary"
            variant="contained"
            sx={{ borderEndEndRadius: 16, borderStartEndRadius: 16 }}
            className="h-14"
        >
            <Search width="256" height="256" />
        </Button>
    );
}
