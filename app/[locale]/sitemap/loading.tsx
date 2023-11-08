import CardSkeleton from "@/components/common/loading-skeleton/card-skeleton";
import CardsSectionSkeleton from "@/components/common/loading-skeleton/cards-section";
import { Skeleton, Box, Container, Typography } from "@mui/material";

const Loading = () => {
    const sitemap = Array.from({ length: 24 });

    return (
        <Container maxWidth={"xl"}>
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
                {sitemap.map((map, i) => (
                    <div className="space-y-4" key={i}>
                        <Skeleton width={100} />
                        <div className="flex col-span-1 justify-start items-center gap-4">
                            <Skeleton className="flex-none" variant="circular" width={60} height={60} />
                            <Skeleton width={100} />
                        </div>
                        <div className="ms-8 flex col-span-1 justify-start items-center gap-4">
                            <Skeleton className="flex-none" variant="circular" width={40} height={40} />
                            <Skeleton width={80} />
                        </div>
                        <div className="ms-8 flex col-span-1 justify-start items-center gap-4">
                            <Skeleton className="flex-none" variant="circular" width={40} height={40} />
                            <Skeleton width={80} />
                        </div>
                        <div className="ms-8 flex col-span-1 justify-start items-center gap-4">
                            <Skeleton className="flex-none" variant="circular" width={40} height={40} />
                            <Skeleton width={80} />
                        </div>
                    </div>
                ))}
            </section>
            <Skeleton height={200} />
        </Container>
    );
};

export default Loading;
