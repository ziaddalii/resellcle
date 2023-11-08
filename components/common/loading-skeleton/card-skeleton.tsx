import { Box, Skeleton } from "@mui/material";
import React from "react";

const CardSkeleton = () => {
    return (
        <div className="grid col-span-1">
            <Skeleton variant="rectangular" height={170} />
            <div className="p-4 border-1 border">
                <Skeleton />
                <Skeleton width="60%" />
            </div>
        </div>
    );
};

export default CardSkeleton;
