import {Box, CardActionArea, Typography} from "@mui/material";
import Image from "next/image";
import PlaceIcon from "@mui/icons-material/Place";
import FavoriteButton from "../buttons/favorite.button";
import {GlobalInterface} from "@/interfaces/global.interface";
import {format_duration_diff_from_months_to_seconds} from "@/util/formatting.util";
import {AdModel} from "@/api/interfaces.api";

interface Props extends GlobalInterface, Omit<AdModel, "filters_extras"> { }

export default function AdCard({
    id,
    seller,
    card_url,
    photos,
    slug,
    name,
    names,
    description,
    descriptions,
    seo_tags,
    price,
    state,
    location,
    status,
    categories,
    extras,
    comments,
    order,
    created_at,
    locale,
    t,
}: Props) {
    const formatted_price = price.toLocaleString("en-US"); 

    return (
        <Box className="relative">
            <FavoriteButton locale={locale} ad_id={id} />

            <a
                id={id}
                href={`/ads/details/${slug}`}
                className="block mb-4 col-span-1 border-1 border-solid border-gray-200 border items-center relative"
            >
                <CardActionArea>
                    <Box className="border-1 h-[166px] border-primary-500/50">
                        <Image
                            width={1000}
                            height={1000}
                            className="object-contain h-full w-full mx-auto"
                            src={card_url}
                            alt={name ?? names[locale!] ?? `ad-${id}`}
                        />
                    </Box>

                    <Box className="p-4 space-y-2">
                        <Typography className="!font-bold text-base text-ellipsis whitespace-nowrap overflow-hidden" component="h3">
                            {names[locale!]}
                        </Typography>

                        <Typography component="span" className="!text-sm">
                            {t!("fields.price_in_egp")} {formatted_price}
                        </Typography>
                        <Typography component="p" className="!text-sm text-ellipsis whitespace-nowrap overflow-hidden">
                            {descriptions[locale!]}
                        </Typography>
                        <Box className="flex justify-between flex-wrap items-center">
                            <Box>
                                <PlaceIcon fontSize="small" color="primary" />
                                <Typography component="span" className="!text-sm !text-gray-600">
                                    {location.province.names[locale!]}
                                </Typography>
                            </Box>
                            <Typography component="span" className="!text-xs !text-gray-600">
                                {format_duration_diff_from_months_to_seconds(created_at, t!)} {t!("fields.ago")}
                            </Typography>

                        </Box>
                    </Box>
                </CardActionArea>
            </a>
        </Box>
    );
}
