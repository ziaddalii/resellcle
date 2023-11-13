import {Box, Container, Grid} from "@mui/material";
import {GlobalInterface} from "@/interfaces/global.interface";
import {AdModel, AdSenseModel} from "@/api/interfaces.api";
import {getCookie} from "cookies-next";
import {SellerCard} from "@/components/pages/details/main-section";
import AdCard from "@/components/common/cards/ad.card";
import AdsenseAd from "@/components/common/ads/adsense.ad";
import {AdsensePositions} from "@/enums/adsense-positions.enum";

interface Props extends GlobalInterface {
    items: AdModel[];
    
    ad_sense_side_bar: AdSenseModel;
}

export default function DetailsSideSection({locale, t, items, ad_sense_side_bar, seller, ad_id}: Props) {
    const user_id = getCookie("user_id");
    
    return (
        <Grid item md={5} xs={12} className="space-y-8">
            
            <Container maxWidth="xl">
                
                {/* Seller Card */}
                <div className="md:block hidden">
                    <SellerCard seller={seller} ad_id={ad_id} locale={locale} t={t} user_id={user_id ?? ""}/>
                </div>
                
                    {/*Ads */}
                    <Box className="md:space-y-8 grid md:grid-cols-1 grid-cols-2 md:gap-0 gap-4 mt-4">
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
                    
                    {/*Adsense Space*/}
                    <AdsenseAd
                        tags_body={ad_sense_side_bar.tags.body}
                        photo_url={ad_sense_side_bar.photo_url}
                        width={ad_sense_side_bar.width}
                        height={ad_sense_side_bar.height}
                        id={`adsense-${AdsensePositions.AD_SIDE_BAR}`}
                        is_visible={ad_sense_side_bar.is_visible}
                    />
            </Container>
        
        </Grid>
    );
}
