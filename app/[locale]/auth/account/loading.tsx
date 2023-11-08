import CardSkeleton from "@/components/common/loading-skeleton/card-skeleton";
import CardsSection from "@/components/common/loading-skeleton/cards-section";
import { Skeleton, Box, Container, Typography } from "@mui/material";

const Loading = () => {
    return (
        <Container>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                <div className="col-span-1">
                    <Skeleton width={300} />
                    <div className="space-y-4">
                        <Skeleton width={100} />
                        <Skeleton width={150} />
                        <Skeleton width={100} />
                    </div>
                </div>
                <div className="col-span-1">
                    <Skeleton width={300} />
                    <div className="space-y-4">
                        <Skeleton width={100} />
                        <Skeleton width={150} />
                        <Skeleton width={100} />
                    </div>
                </div>
                <div className="col-span-1">
                    <Skeleton width={300} />
                    <div className="space-y-4">
                        <Skeleton width={100} />
                        <Skeleton width={150} />
                        <Skeleton width={100} />
                    </div>
                </div>
            </div>
            <Skeleton height={200} />
            <Skeleton width={100} />
            <CardsSection/>
            <CardsSection/>
            <CardsSection/>
            <CardsSection/>
            <Skeleton height={200} />
        </Container>
    );
};

export default Loading;
