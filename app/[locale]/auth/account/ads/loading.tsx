import { Skeleton, Box, Container, Typography } from "@mui/material";

const Loading = () => {
    return (
        <Container maxWidth="lg">
            <Skeleton height={100} />

            <div className="my-10">
                <div className="border border-1 grid grid-cols-4 gap-4 justify-start items-center p-4">
                    <Skeleton className="col-span-1" width={30} />
                    <Skeleton className="col-span-1" width={50} />
                    <Skeleton className="col-span-1" width={30} />
                    <Skeleton className="col-span-1" width={50} />
                </div>
                <div className="border border-1 grid grid-cols-4 gap-4 justify-start items-center py-10 px-4">
                    <Skeleton className="col-span-1" width={50} />
                    <Skeleton className="col-span-1" width={50} />
                    <Skeleton className="col-span-1" width={50} />
                    <Skeleton className="col-span-1" width={30} />
                </div>
                <div className="border border-1 grid grid-cols-4 gap-4 justify-start items-center py-10 px-4">
                    <Skeleton className="col-span-1" width={50} />
                    <Skeleton className="col-span-1" width={50} />
                    <Skeleton className="col-span-1" width={50} />
                    <Skeleton className="col-span-1" width={30} />
                </div>
                <div className="border border-1 grid grid-cols-4 gap-4 justify-start items-center py-10 px-4">
                    <Skeleton className="col-span-1" width={50} />
                    <Skeleton className="col-span-1" width={50} />
                    <Skeleton className="col-span-1" width={50} />
                    <Skeleton className="col-span-1" width={30} />
                </div>
                <div className="border border-1 grid grid-cols-4 gap-4 justify-start items-center py-10 px-4">
                    <Skeleton className="col-span-1" width={50} />
                    <Skeleton className="col-span-1" width={50} />
                    <Skeleton className="col-span-1" width={50} />
                    <Skeleton className="col-span-1" width={30} />
                </div>
            </div>
            <Skeleton height={200} />
        </Container>
    );
};

export default Loading;
