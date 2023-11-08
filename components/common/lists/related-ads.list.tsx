import AdCard from "@/components/common/cards/ad.card";
import {Box, Container} from "@mui/material";
import {NoAdsFound} from "./ads.list";
import {GlobalInterface} from "@/interfaces/global.interface";
import {AdModel} from "@/api/interfaces.api";

interface RelatedAdsListProps extends GlobalInterface {
    items: AdModel[];
    with_empty_message?: boolean;
}

export function RelatedAdsList({items, with_empty_message = false, locale, t}: RelatedAdsListProps) {
    
    return (
        <div className="space-y-8">
            
            <p className="p-4 font-bold bg-secondary-100 mx-auto border-solid rounded-none">
                {t!("fields.related_ads")}
            </p>

            {/* if with_empty_message show empty section as a separate component same file if count 0*/}
            {with_empty_message && items.length === 0 ? (
                <NoAdsFound locale={locale}/>
            ) : (
                <Box component="div" className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
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
            )
            }
        </div>
    )
        ;
}
