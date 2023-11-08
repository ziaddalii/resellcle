import CardSkeleton from "@/components/common/loading-skeleton/card-skeleton";
import CardsSection from "@/components/common/loading-skeleton/cards-section";
import { Skeleton, Box, Container, Typography } from "@mui/material";

const Loading = () => {
    return (
        <Container>
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
