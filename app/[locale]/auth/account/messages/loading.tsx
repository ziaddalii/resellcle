import { Skeleton, Box, Container, Typography } from "@mui/material";

const Loading = () => {
    return (
        <Container maxWidth="xl">
            <div className="grid md:grid-cols-2 grid-cols-1 my-10 md:h-[70vh] h-[140vh]">
                {/* Chats */}
                <section className="col-span-1 h-[70vh]">
                    <Skeleton width={80} />
                    <div className="flex gap-4 p-4">
                        <Skeleton width={60} />
                        <Skeleton width={70} />
                        <Skeleton width={60} />
                    </div>
                    {/* Chat Cards */}
                    <div className="flex items-center justify-start p-4 gap-4">
                        <Skeleton className="flex-none" variant="circular" width={80} height={80} />
                        <div>
                            <Skeleton width={110} />
                            <Skeleton width={150} />
                        </div>
                    </div>
                    <div className="flex items-center justify-start p-4 gap-4">
                        <Skeleton className="flex-none" variant="circular" width={80} height={80} />
                        <div>
                            <Skeleton width={110} />
                            <Skeleton width={150} />
                        </div>
                    </div>
                    <div className="flex items-center justify-start p-4 gap-4">
                        <Skeleton className="flex-none" variant="circular" width={80} height={80} />
                        <div>
                            <Skeleton width={110} />
                            <Skeleton width={150} />
                        </div>
                    </div>
                </section>
                {/* Convo */}
                <section className="col-span-1 border border-1 p-4 h-[70vh]"> 
                    {/* Title */}
                    <div className="flex items-center justify-start p-4 gap-4">
                        <Skeleton className="flex-none" variant="circular" width={40} height={40} />
                        <Skeleton width={200} />
                    </div>
                    {/* Messages */}
                    <div className="border-1 space-y-4">
                        <Skeleton width={180} height={80} />
                        <Skeleton width={200} height={80}/>
                        <Skeleton className="ms-auto" width={180} height={80}/>
                        <Skeleton className="ms-auto" width={200} height={80}/>
                    </div>
                </section>
            </div>
        </Container>
    );
};

export default Loading;
