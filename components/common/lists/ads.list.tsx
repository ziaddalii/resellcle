import {Box, Container, Typography} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {GlobalInterface} from "@/interfaces/global.interface";
import {AdModel} from "@/api/interfaces.api";
import AdCard from "@/components/common/cards/ad.card";

interface AdsListProps extends GlobalInterface {
    items: AdModel[];
    with_empty_message?: boolean;
}

interface NoAdsFoundProps extends GlobalInterface {}


export function AdsList({items, with_empty_message = true, locale, t}: AdsListProps) {
    
    return (
        <Container maxWidth="xl" component="section">
            {with_empty_message && items.length === 0 ? (
                <NoAdsFound t={t}/>
            ) : (
                <Box className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
                    {items.map((e) => {
                        return (
                            <AdCard
                                key={e.id}
                                id={e.id}
                                name={e.names[locale]}
                                names={e.names}
                                card_url={e.card_url}
                                price={e.price}
                                duration={e.created_at}
                                categories={e.categories}
                                comments={e.comments}
                                created_at={e.created_at}
                                description={e.description}
                                descriptions={e.descriptions}
                                extras={e.extras}
                                location={e.location}
                                order={e.order}
                                photos={e.photos}
                                seller={e.seller}
                                seo_tags={e.seo_tags}
                                status={e.status}
                                state={e.state}
                                locale={locale}
                                t={t}
                            />
                        );
                    })}
                </Box>
            )}
        </Container>
    );
}

export function NoAdsFound({t}: NoAdsFoundProps) {
    return (
        <Box minHeight="50vh" className="flex flex-col flex-1 gap-4 justify-center items-center">
            
            <ErrorOutlineIcon color="primary" sx={{fontSize: "8rem"}}/>
            
            <Typography
                variant="h6">
                {t!("fields.no_ads_found")}
            </Typography>
        
        </Box>
    );
}
