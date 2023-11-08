import CardSkeleton from "@/components/common/loading-skeleton/card-skeleton";
import CardsSectionSkeleton from "@/components/common/loading-skeleton/cards-section";
import { Skeleton, Box, Container, Typography } from "@mui/material";

const Loading = () => {
    return (
        <Container maxWidth={"xl"}>
            <Skeleton height={200} />
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* AD DETAILS SECTION */}
                <article className="col-span-2">
                    <Skeleton width={722} height={500}/>
                    <div className="grid md:grid-cols-2 grid-cols-1">
                        <div className="col-span-1">
                            <Skeleton width={200} />
                        </div>
                        <div className="col-span-1">
                            <Skeleton width={130} />
                        </div>
                        <div className="col-span-1">
                            <Skeleton width={200} />
                        </div>
                        <div className="col-span-1">
                            <Skeleton width={130} />
                        </div>
                    </div>
                </article>
                <article className="col-span-1">
                    <CardSkeleton/>
                    <CardSkeleton/>
                </article>
            </section>
            <CardsSectionSkeleton/>
            <Skeleton height={200} />
        </Container>
    );
}; 

export default Loading;
