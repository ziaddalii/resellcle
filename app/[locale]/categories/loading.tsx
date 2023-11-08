import CardSkeleton from "@/components/common/loading-skeleton/card-skeleton";
import CardsSectionSkeleton from "@/components/common/loading-skeleton/cards-section";
import { Skeleton, Box, Container, Typography } from "@mui/material";

const Loading = () => {
    const categories = Array.from({ length: 24 });

    return (
        <Container maxWidth={"xl"}>
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
                {categories.map((category, i) => (
                    <div key={i} className="flex col-span-1 justify-center items-center gap-4">
                        <Skeleton variant="circular" width={60} height={60} />
                        <Skeleton width={100} />
                    </div>
                ))}
            </section>
            <Skeleton height={200} />
        </Container>
    );
};

export default Loading;
