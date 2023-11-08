import {Box, Typography} from "@mui/material";
import Image from "next/image";
import {GlobalInterface} from "@/interfaces/global.interface";
import {Seller} from "@/api/interfaces.api";

interface Props extends GlobalInterface {
    seller: Seller;
}

export default function SellerHeaderSection({seller, locale}: Props) {
    return (
        <Box
            className="bg-secondary-100 flex flex-col flex-1 items-center justify-center mx-auto p-8">
            <Image
                className=" object-contain !rounded-full"
                alt={seller.name}
                src={seller.logo}
                width={150}
                height={150}
            />
            <Typography variant="h6">{seller.names[locale]}</Typography>
            <Typography variant="body1">{seller.descriptions[locale]}</Typography>
        </Box>
    );
}
