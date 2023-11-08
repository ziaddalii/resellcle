import React from "react";
import CardSkeleton from "./card-skeleton";

const CardsSectionSkeleton = () => {
    const ads = Array.from({ length: 4 });

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
            {ads.map((ad, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
};

export default CardsSectionSkeleton;
